@echo off
REM Save as UTF-8 without BOM. A leading BOM makes CMD fail on the first line (mojibake before @echo).
REM Launcher: copy to %TEMP% so the running script is never affected by edits to this file.
if /i "%~1"=="__run__" goto :bootstrap

set "PIXELMON_ROOT=%~dp0"
set "PIXELMON_ROOT=%PIXELMON_ROOT:~0,-1%"
set "RUNNER=%TEMP%\pixelmon_codebase_%RANDOM%.cmd"
copy /y "%~f0" "%RUNNER%" >nul
if errorlevel 1 (
    echo ERROR: Could not copy codebase.bat to %TEMP%
    exit /b 1
)
call "%RUNNER%" __run__
set "EXIT_CODE=%ERRORLEVEL%"
del "%RUNNER%" 2>nul
exit /b %EXIT_CODE%

:bootstrap
setlocal EnableDelayedExpansion
if not defined PIXELMON_ROOT (
    echo ERROR: PIXELMON_ROOT not set.
    endlocal
    exit /b 1
)
set "PROJECT_DIR=%PIXELMON_ROOT%"

REM ========================================
REM PIXELMON (VOXEL LEGENDS) - CODEBASE STATE CHECK
REM ========================================
REM Run from repo root: double-click codebase.bat or run from E:\maha\Pixelmon
REM
REM Mirrors contact360.io\app\codebase.bat + api\codebase.bat structure for a Node monorepo:
REM   0 Game asset inventory (+ reports\asset-inventory.txt)
REM   1 Clean + npm install (root, server, client)
REM   2 Data preflight (build-slim / pokemons.slim.json — warn-only like app codegen)
REM   3 Typecheck (skipped — JavaScript, no tsc)
REM   4 Prettier (npx --check / --write on client + server sources)
REM   5 ESLint (npm run lint / lint:fix)
REM   6 Tests (server node:test + client vitest)
REM   6b Vitest coverage if RUN_TEST_COVERAGE=1
REM   7 Production build (build-slim + vite client\dist)
REM   8 Optional dev server (npm run dev) after summary if checks pass
REM
REM npm run test at root = server + client unit tests (no clean/install).
REM For a quick CI-style gate: SKIP_ASSET_INVENTORY=1 SKIP_CLEAN=1 then npm run lint && npm run test && npm run build
REM
REM Optional environment variables:
REM SKIP_ASSET_INVENTORY=1     Skip step 0
REM SKIP_CLEAN=1               Keep node_modules; remove client\dist, coverage, build only
REM SKIP_NPM_INSTALL=1         Skip step 1 install (parity with api SKIP_PIP_INSTALL)
REM SKIP_DATA_SETUP=1          Skip step 2 build-slim preflight
REM DATA_SETUP_NO_FAIL=1       build-slim failure -> warning only (default: warning)
REM SKIP_PRETTIER=1            Skip step 4
REM RUN_PRETTIER=1             Run Prettier even without .prettierrc in repo root
REM SKIP_ESLINT=1              Skip step 5
REM SKIP_TESTS=1               Skip step 6
REM RUN_TEST_COVERAGE=1        Step 6b: vitest --coverage in client
REM SKIP_BUILD=1               Skip step 7
REM AUTO_START_DEV=1           Start npm run dev without prompting
REM AUTO_SKIP_DEV=1            Never prompt for dev server
REM
REM PowerShell: if npm.ps1 is blocked, this script uses npm.cmd where noted.
REM Client: http://localhost:3000   API: http://localhost:4000/api/health
REM ========================================

set "ERROR_COUNT=0"
set "WARNING_COUNT=0"
set "START_TIME=%TIME%"
set "ASSET_GLB_COUNT=0"
set "SECTION0_STATUS=SKIPPED"
set "SECTION1_STATUS=SKIPPED"
set "SECTION2_STATUS=SKIPPED"
set "SECTION3_STATUS=SKIPPED"
set "SECTION4_STATUS=SKIPPED"
set "SECTION5_STATUS=SKIPPED"
set "SECTION6_STATUS=SKIPPED"
set "SECTION6_COVERAGE_STATUS=SKIPPED"
set "SECTION7_STATUS=SKIPPED"

REM ANSI ESC (char 27). Avoid "prompt $E | cmd" — breaks CALL :color_echo on some Windows builds.
set "ESC="
for /f "delims=" %%A in ('powershell -NoProfile -Command "Write-Output ([char]27)" 2^>nul') do set "ESC=%%A"
set "GREEN=%ESC%[92m"
set "RED=%ESC%[91m"
set "YELLOW=%ESC%[93m"
set "BLUE=%ESC%[94m"
set "CYAN=%ESC%[96m"

goto :main

:color_echo
setlocal EnableDelayedExpansion
REM Prefix/strip: CMD treats values starting with "=" as part of the name (breaks separator lines).
set "_ce_c=%~1"
set "_ce_t=x%~2"
set "_ce_t=!_ce_t:~1!"
echo !_ce_c!!_ce_t!
endlocal
goto :eof

:main
if not exist "%PROJECT_DIR%\package.json" (
    call :color_echo "%RED%" "ERROR: package.json not found under: %PROJECT_DIR%"
    goto :end_fail
)

cd /d "%PROJECT_DIR%"
echo.
call :color_echo "%CYAN%" "========================================"
call :color_echo "%CYAN%" "  PIXELMON CODEBASE STATE CHECK"
call :color_echo "%CYAN%" "========================================"
echo.
call :color_echo "%BLUE%" "Current directory: %CD%"
echo.

REM --- [0] Asset inventory ---
if /i "%SKIP_ASSET_INVENTORY%"=="1" (
    call :color_echo "%YELLOW%" "[0/9] Asset inventory skipped (SKIP_ASSET_INVENTORY=1)"
    set "SECTION0_STATUS=SKIPPED"
    echo.
) else (
    call :color_echo "%CYAN%" "[0/9] Game asset inventory..."
    echo ----------------------------------------
    call :color_echo "%BLUE%" "  Core GLBs, biome model count, reports\asset-inventory.txt"
    if not exist "reports" mkdir reports
    call :count_game_assets
    call :ensure_core_glbs
    call :ensure_idea_glbs
    (
        echo PIXELMON - Game asset inventory
        echo Generated: %DATE% %TIME%
        echo.
        echo GLB files under public\assets (recursive^): !ASSET_GLB_COUNT!
        echo.
        echo Core fallbacks:
        if exist "public\assets\player.glb" (echo   OK player.glb) else (echo   MISSING player.glb)
        if exist "public\assets\companion.glb" (echo   OK companion.glb) else (echo   MISSING companion.glb)
        if exist "public\assets\wild_creature.glb" (echo   OK wild_creature.glb) else (echo   MISSING wild_creature.glb)
        echo.
        echo Data:
        if exist "data\game\pokemons.slim.json" (echo   OK data\game\pokemons.slim.json) else (echo   MISSING pokemons.slim.json)
        if exist "public\assets\dataSet\pokemons.json" (echo   OK public\assets\dataSet\pokemons.json) else (echo   MISSING pokemons.json)
    ) > "reports\asset-inventory.txt"
    call :color_echo "%BLUE%" "  public\assets GLB files (recursive): !ASSET_GLB_COUNT!"
    set "SECTION0_STATUS=PASSED"
    if not exist "public\assets\player.glb" (
        set /a WARNING_COUNT+=1
        set "SECTION0_STATUS=WARNING"
        call :color_echo "%YELLOW%" "  ! public\assets\player.glb missing"
    )
    if not exist "public\assets\companion.glb" (
        set /a WARNING_COUNT+=1
        set "SECTION0_STATUS=WARNING"
        call :color_echo "%YELLOW%" "  ! public\assets\companion.glb missing"
    )
    if not exist "public\assets\wild_creature.glb" (
        set /a WARNING_COUNT+=1
        set "SECTION0_STATUS=WARNING"
        call :color_echo "%YELLOW%" "  ! public\assets\wild_creature.glb missing"
    )
    if "!SECTION0_STATUS!"=="PASSED" (
        call :color_echo "%GREEN%" "  OK Core game assets present"
    ) else (
        call :color_echo "%GREEN%" "  OK Inventory written (see warnings above)"
    )
    echo.
)

REM --- [1] Clean + install ---
call :color_echo "%CYAN%" "[1/9] Cleaning and preparing..."
echo ----------------------------------------
if /i "%SKIP_CLEAN%"=="1" (
    call :color_echo "%YELLOW%" "  SKIP_CLEAN=1: keeping node_modules"
    if exist ".next" (
        call :color_echo "%YELLOW%" "  Removing .next\"
        rd /s /q ".next"
    )
    if exist "coverage" rd /s /q "coverage"
    if exist "build" rd /s /q "build"
) else (
    call :color_echo "%YELLOW%" "  Removing node_modules, .next, coverage, build"
    if exist "node_modules" rd /s /q "node_modules"
    if exist ".next" rd /s /q ".next"
    if exist "coverage" rd /s /q "coverage"
    if exist "build" rd /s /q "build"
    call :color_echo "%GREEN%" "  OK Clean completed"
)
echo.
if /i "%SKIP_NPM_INSTALL%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped install (SKIP_NPM_INSTALL=1)"
    set "SECTION1_STATUS=SKIPPED"
) else (
    call :color_echo "%YELLOW%" "  Running: npm.cmd install"
    set "STEP01_FAIL=0"
    call npm.cmd install
    if errorlevel 1 set "STEP01_FAIL=1"
    if "!STEP01_FAIL!"=="1" (
        set /a ERROR_COUNT+=1
        set "SECTION1_STATUS=FAILED"
        call :color_echo "%RED%" "  X npm install failed"
        goto :summary
    ) else (
        set "SECTION1_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK Dependencies installed"
        call :color_echo "%BLUE%" "  Running: npm.cmd audit (advisory)"
        call npm.cmd audit 2>nul
        if errorlevel 1 (
            set /a WARNING_COUNT+=1
            call :color_echo "%YELLOW%" "  ! npm audit reported issues (run: npm audit)"
        ) else (
            call :color_echo "%GREEN%" "  OK audit clean"
        )
    )
)
echo.

REM --- [2] Data preflight ---
call :color_echo "%CYAN%" "[2/9] Data preflight (pokemons.slim.json)..."
echo ----------------------------------------
if /i "%SKIP_DATA_SETUP%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_DATA_SETUP=1)"
    set "SECTION2_STATUS=SKIPPED"
) else (
    call :color_echo "%BLUE%" "  Same role as Contact360 codegen: ensures slim catalog exists before build."
    if exist "data\game\pokemons.slim.json" (
        set "SECTION2_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK data\game\pokemons.slim.json already present"
    ) else (
        call :color_echo "%YELLOW%" "  Running: node scripts\build-slim.cjs"
        call node scripts\build-slim.cjs
        if errorlevel 1 (
            if /i "%DATA_SETUP_NO_FAIL%"=="1" (
                set /a WARNING_COUNT+=1
                set "SECTION2_STATUS=WARNING"
                call :color_echo "%YELLOW%" "  ! build-slim failed (DATA_SETUP_NO_FAIL=1)"
            ) else (
                set /a WARNING_COUNT+=1
                set "SECTION2_STATUS=WARNING"
                call :color_echo "%YELLOW%" "  ! build-slim failed — ensure public\assets\dataSet\pokemons.json exists"
            )
        ) else if exist "data\game\pokemons.slim.json" (
            set "SECTION2_STATUS=PASSED"
            call :color_echo "%GREEN%" "  OK pokemons.slim.json generated"
        ) else (
            set /a WARNING_COUNT+=1
            set "SECTION2_STATUS=WARNING"
            call :color_echo "%YELLOW%" "  ! build-slim exited 0 but output file missing"
        )
    )
)
echo.

REM --- [3] Typecheck (skipped) ---
call :color_echo "%CYAN%" "[3/9] Type checking..."
echo ----------------------------------------
call :color_echo "%BLUE%" "  Skipped: JavaScript monorepo (client Vite + server Express; no tsc)."
set "SECTION3_STATUS=SKIPPED"
echo.

REM --- [4] Prettier ---
call :color_echo "%CYAN%" "[4/9] Prettier (format check)..."
echo ----------------------------------------
if /i "%SKIP_PRETTIER%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_PRETTIER=1)"
    set "SECTION4_STATUS=SKIPPED"
) else (
    if not exist ".prettierrc" if not exist ".prettierrc.json" if not exist ".prettierrc.js" if /i not "%RUN_PRETTIER%"=="1" (
        call :color_echo "%YELLOW%" "  Skipped (no .prettierrc; set RUN_PRETTIER=1 to format client/server JS)"
        set "SECTION4_STATUS=SKIPPED"
    ) else (
        where npx >nul 2>&1
        if errorlevel 1 (
            set /a WARNING_COUNT+=1
            set "SECTION4_STATUS=WARNING"
            call :color_echo "%YELLOW%" "  ! npx not on PATH — install Node.js or set SKIP_PRETTIER=1"
        ) else (
            call :color_echo "%BLUE%" "  Targets: src, eslint.config.mjs, package.json"
            call :color_echo "%YELLOW%" "  Running: npx prettier --check ..."
            call npx prettier --check "src/**/*.{js,jsx}" eslint.config.mjs package.json
            if errorlevel 1 (
                set /a WARNING_COUNT+=1
                set "SECTION4_STATUS=WARNING"
                call :color_echo "%YELLOW%" "  Prettier found issues — running: npx prettier --write ..."
                call npx prettier --write "src/**/*.{js,jsx}" eslint.config.mjs package.json
                if errorlevel 1 (
                    set /a ERROR_COUNT+=1
                    set "SECTION4_STATUS=FAILED"
                    call :color_echo "%RED%" "  X Prettier --write failed"
                ) else (
                    call npx prettier --check "src/**/*.{js,jsx}" eslint.config.mjs package.json
                    if errorlevel 1 (
                        set /a ERROR_COUNT+=1
                        set "SECTION4_STATUS=FAILED"
                        call :color_echo "%RED%" "  X Prettier check still failing after write"
                    ) else (
                        set "SECTION4_STATUS=WARNING_FIXED"
                        call :color_echo "%GREEN%" "  OK Prettier formatted and verified"
                    )
                )
            ) else (
                set "SECTION4_STATUS=PASSED"
                call :color_echo "%GREEN%" "  OK Prettier check passed"
            )
        )
    )
)
echo.

REM --- [5] Lint ---
call :color_echo "%CYAN%" "[5/9] Linting (ESLint)..."
echo ----------------------------------------
if /i "%SKIP_ESLINT%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_ESLINT=1)"
    set "SECTION5_STATUS=SKIPPED"
) else (
    call :color_echo "%YELLOW%" "  Running: npm.cmd run lint"
    call npm.cmd run lint
    if errorlevel 1 (
        set /a ERROR_COUNT+=1
        set "SECTION5_STATUS=FAILED"
        call :color_echo "%RED%" "  X Linting errors found"
        call npm.cmd run lint:fix
        if not errorlevel 1 (
            call npm.cmd run lint
            if not errorlevel 1 (
                set /a ERROR_COUNT-=1
                set "SECTION5_STATUS=WARNING_FIXED"
                call :color_echo "%GREEN%" "  OK Linting issues resolved"
            )
        )
    ) else (
        set "SECTION5_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK No linting errors"
    )
)
echo.

REM --- [6] Tests ---
call :color_echo "%CYAN%" "[6/9] Running tests..."
echo ----------------------------------------
if /i "%SKIP_TESTS%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_TESTS=1)"
    set "SECTION6_STATUS=SKIPPED"
) else (
    call :color_echo "%BLUE%" "  server: node --test"
    call :color_echo "%YELLOW%" "  Running: npm.cmd run test:server"
    call npm.cmd run test:server
    if errorlevel 1 (
        set /a ERROR_COUNT+=1
        set "SECTION6_STATUS=FAILED"
        call :color_echo "%RED%" "  X Tests failed"
    ) else (
        set "SECTION6_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK All tests passed"
    )
)
echo.

REM --- [6b] Coverage ---
call :color_echo "%BLUE%" "[6b] Coverage skipped (Client Vitest migrated to unified repository)"
echo.

REM --- [7] Build ---
call :color_echo "%CYAN%" "[7/9] Production build check..."
echo ----------------------------------------
if /i "%SKIP_BUILD%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_BUILD=1)"
    set "SECTION7_STATUS=SKIPPED"
) else (
    call :color_echo "%YELLOW%" "  Running: node scripts\build-slim.cjs"
    call node scripts\build-slim.cjs
    call :color_echo "%YELLOW%" "  Running: npm.cmd run build"
    call npm.cmd run build
    if errorlevel 1 (
        set /a ERROR_COUNT+=1
        set "SECTION7_STATUS=FAILED"
        call :color_echo "%RED%" "  X Build failed"
    ) else if exist ".next" (
        set "SECTION7_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK Build successful (.next)"
    ) else (
        set /a ERROR_COUNT+=1
        set "SECTION7_STATUS=FAILED"
        call :color_echo "%RED%" "  X .next build output not found"
    )
)
echo.

:summary
echo.
call :color_echo "%CYAN%" "========================================"
call :color_echo "%CYAN%" "  SUMMARY"
call :color_echo "%CYAN%" "========================================"
echo.
call :color_echo "%BLUE%" "Section Status:"
echo   [0] Game asset inventory:             !SECTION0_STATUS!  (glb=!ASSET_GLB_COUNT!, reports\asset-inventory.txt)
echo   [1] Cleanup and npm install:          !SECTION1_STATUS!
echo   [2] Data preflight (build-slim):      !SECTION2_STATUS!
echo   [3] Type checking (JS - skipped):     !SECTION3_STATUS!
echo   [4] Prettier:                         !SECTION4_STATUS!
echo   [5] ESLint:                           !SECTION5_STATUS!
echo   [6] Tests (node:test):                !SECTION6_STATUS!
echo   [6b] Vitest coverage:                 !SECTION6_COVERAGE_STATUS!
echo   [7] Build (Next.js):                  !SECTION7_STATUS!
echo.

if !ERROR_COUNT! EQU 0 (
    call :color_echo "%GREEN%" "  OK All blocking checks passed!"
    if !WARNING_COUNT! GTR 0 call :color_echo "%YELLOW%" "  Found !WARNING_COUNT! warning(s)"
    echo.
    if /i "%AUTO_SKIP_DEV%"=="1" goto :end_ok
    if /i "%AUTO_START_DEV%"=="1" goto :dev_server
    call :color_echo "%CYAN%" "  Start development server? (Y/N)"
    choice /C YN /N /M ""
    if errorlevel 2 goto :end_ok
    if errorlevel 1 goto :dev_server
    goto :end_ok
) else (
    call :color_echo "%RED%" "  X Found !ERROR_COUNT! error(s)"
    if !WARNING_COUNT! GTR 0 call :color_echo "%YELLOW%" "  Found !WARNING_COUNT! warning(s)"
    echo.
    call :color_echo "%YELLOW%" "  Please fix the errors before proceeding."
    goto :end_fail
)

:dev_server
echo.
call :color_echo "%CYAN%" "[8/9] Starting development server..."
call :color_echo "%BLUE%" "  Game & API: http://localhost:3000"
call :color_echo "%BLUE%" "  API Health: http://localhost:3000/api/health"
call :color_echo "%YELLOW%" "  Press Ctrl+C to stop"
echo.
call npm.cmd run dev
goto :end_ok

:end_ok
echo.
call :color_echo "%CYAN%" "========================================"
call :color_echo "%CYAN%" "  CHECK COMPLETE"
call :color_echo "%CYAN%" "========================================"
echo.
endlocal
exit /b 0

:end_fail
echo.
call :color_echo "%CYAN%" "========================================"
call :color_echo "%CYAN%" "  CHECK COMPLETE"
call :color_echo "%CYAN%" "========================================"
echo.
endlocal
exit /b 1

REM ===========================================================================
REM Helpers (never reached by fall-through from :main)
REM ===========================================================================

:count_game_assets
set "ASSET_GLB_COUNT=0"
if exist "public\assets" (
    for /f %%C in ('dir /s /b "public\assets\*.glb" 2^>nul ^| find /c /v ""') do set "ASSET_GLB_COUNT=%%C"
)
goto :eof

:ensure_core_glbs
set "PLACEHOLDER=public\assets\models\glb\regular\226.glb"
if not exist "!PLACEHOLDER!" goto :eof
if not exist "public\assets\player.glb" copy /y "!PLACEHOLDER!" "public\assets\player.glb" >nul
if not exist "public\assets\companion.glb" copy /y "!PLACEHOLDER!" "public\assets\companion.glb" >nul
if not exist "public\assets\wild_creature.glb" copy /y "!PLACEHOLDER!" "public\assets\wild_creature.glb" >nul
goto :eof

:ensure_idea_glbs
if not exist "public\assets\idea_glbs" mkdir "public\assets\idea_glbs"
if not exist "public\assets\idea_glbs\fantasy_assets.glb" (
    if exist "docs\idea_glbs\fantasy_assets.glb" (
        call :color_echo "%YELLOW%" "  Copying docs\idea_glbs\fantasy_assets.glb to public\assets\idea_glbs\"
        copy /y "docs\idea_glbs\fantasy_assets.glb" "public\assets\idea_glbs\fantasy_assets.glb" >nul
    )
)
if not exist "public\assets\idea_glbs\small_time_town__village_asset_pack.glb" (
    if exist "docs\idea_glbs\small_time_town__village_asset_pack.glb" (
        call :color_echo "%YELLOW%" "  Copying village asset pack to public\assets\idea_glbs\"
        copy /y "docs\idea_glbs\small_time_town__village_asset_pack.glb" "public\assets\idea_glbs\small_time_town__village_asset_pack.glb" >nul
    )
)
goto :eof
