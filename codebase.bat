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
REM PIXELMON - CODEBASE STATE CHECK
REM ========================================
REM Steps 0-6 in order; step 7 only after summary prompt:
REM   0 assets, 1 clean+install, 2 tsc skip, 3 prettier, 4 eslint,
REM   5 tests, 5b coverage, 6 build, 7 npm start.
REM
REM Optional: SKIP_ASSET_INVENTORY=1  SKIP_CLEAN=1
REM           SKIP_PRETTIER=1  RUN_PRETTIER=1  SKIP_ESLINT=1  RUN_TEST_COVERAGE=1
REM           AUTO_START_DEV=1  AUTO_SKIP_DEV=1
REM ========================================

set "ERROR_COUNT=0"
set "WARNING_COUNT=0"
set "MAIN_ABORT=0"
set "START_DEV=0"
set "SECTION5_COVERAGE_STATUS=SKIPPED"
set "ASSET_GLB_COUNT=0"
set "SECTION0_STATUS=SKIPPED"
set "SECTION1_STATUS=SKIPPED"
set "SECTION2_STATUS=SKIPPED"
set "SECTION3_STATUS=SKIPPED"
set "SECTION4_STATUS=SKIPPED"
set "SECTION5_STATUS=SKIPPED"
set "SECTION6_STATUS=SKIPPED"

set "ESC="
for /f "delims=" %%A in ('powershell -NoProfile -Command "Write-Output ([char]27)" 2^>nul') do set "ESC=%%A"
set "GREEN=%ESC%[92m"
set "RED=%ESC%[91m"
set "YELLOW=%ESC%[93m"
set "BLUE=%ESC%[94m"
set "CYAN=%ESC%[96m"

if not exist "%PROJECT_DIR%" (
    call :color_echo "%RED%" "ERROR: Project directory not found: %PROJECT_DIR%"
    goto :main_exit_fail
)
cd /d "%PROJECT_DIR%"
if not exist "package.json" (
    call :color_echo "%RED%" "ERROR: package.json not found. Run from the Pixelmon repo root."
    goto :main_exit_fail
)

echo.
call :color_echo "%CYAN%" "========================================"
call :color_echo "%CYAN%" "  PIXELMON CODEBASE STATE CHECK"
call :color_echo "%CYAN%" "========================================"
echo.
call :color_echo "%BLUE%" "Current directory: %CD%"
echo.

REM --- Steps 0-6: strict sequential order ---
call :step_00
call :step_01
if "!MAIN_ABORT!"=="1" goto :after_steps
call :step_02
call :step_03
call :step_04
call :step_05
call :step_05b
call :step_06

:after_steps
call :show_summary
if "!START_DEV!"=="1" call :step_07

echo.
call :color_echo "%CYAN%" "========================================"
call :color_echo "%CYAN%" "  CHECK COMPLETE"
call :color_echo "%CYAN%" "========================================"
echo.

if !ERROR_COUNT! GTR 0 goto :main_exit_fail
goto :main_exit_ok

:main_exit_fail
endlocal
exit /b 1

:main_exit_ok
endlocal
exit /b 0

REM ===========================================================================
REM Subroutines below — never reached by fall-through from the orchestrator above
REM ===========================================================================

:color_echo
setlocal EnableDelayedExpansion
set "_ce_c=%~1"
set "_ce_t=x%~2"
set "_ce_t=!_ce_t:~1!"
echo !_ce_c!!_ce_t!
endlocal
goto :eof

:count_game_assets
set "ASSET_GLB_COUNT=0"
if exist "public\assets" (
    for /f %%C in ('dir /s /b "public\assets\*.glb" 2^>nul ^| find /c /v ""') do set "ASSET_GLB_COUNT=%%C"
)
goto :eof

:step_00
if /i "%SKIP_ASSET_INVENTORY%"=="1" (
    call :color_echo "%YELLOW%" "[0/7] Asset inventory skipped (SKIP_ASSET_INVENTORY=1)"
    echo.
    goto :eof
)
call :color_echo "%CYAN%" "[0/7] Game asset inventory..."
echo ----------------------------------------
call :color_echo "%BLUE%" "  Checks core GLBs under public\assets and counts biome models."
call :count_game_assets
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
)
echo.
goto :eof

:step_01
call :color_echo "%CYAN%" "[1/7] Cleaning and preparing..."
echo ----------------------------------------
if /i "%SKIP_CLEAN%"=="1" (
    call :color_echo "%YELLOW%" "  SKIP_CLEAN=1: keeping node_modules, removing build and coverage only"
    if exist "build" (
        call :color_echo "%YELLOW%" "  Removing build\"
        rd /s /q "build"
    )
    if exist "coverage" (
        call :color_echo "%YELLOW%" "  Removing coverage\"
        rd /s /q "coverage"
    )
) else (
    call :color_echo "%YELLOW%" "  Removing node_modules, build, coverage (if present)"
    if exist "node_modules" rd /s /q "node_modules"
    if exist "build" rd /s /q "build"
    if exist "coverage" rd /s /q "coverage"
    call :color_echo "%GREEN%" "  OK Clean completed"
)
echo.
call :color_echo "%YELLOW%" "  Running: npm install"
call npm install
if errorlevel 1 (
    set /a ERROR_COUNT+=1
    set "SECTION1_STATUS=FAILED"
    set "MAIN_ABORT=1"
    call :color_echo "%RED%" "  X npm install failed"
) else (
    set "SECTION1_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK Dependencies installed"
)
echo.
goto :eof

:step_02
call :color_echo "%CYAN%" "[2/7] Type checking..."
echo ----------------------------------------
call :color_echo "%BLUE%" "  Skipped: JavaScript Create React App project (no TypeScript / tsc)."
set "SECTION2_STATUS=SKIPPED"
echo.
goto :eof

:step_03
call :color_echo "%CYAN%" "[3/7] Prettier (format check)..."
echo ----------------------------------------
if /i "%SKIP_PRETTIER%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_PRETTIER=1)"
    set "SECTION3_STATUS=SKIPPED"
    echo.
    goto :eof
)
if not exist ".prettierrc" if not exist ".prettierrc.json" if not exist ".prettierrc.js" if /i not "%RUN_PRETTIER%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (no .prettierrc; set RUN_PRETTIER=1 to run anyway)"
    set "SECTION3_STATUS=SKIPPED"
    echo.
    goto :eof
)
call :color_echo "%YELLOW%" "  Running: npx prettier --check src public"
call npx prettier --check src public
if errorlevel 1 (
    set /a WARNING_COUNT+=1
    call npx prettier --write src public
    if errorlevel 1 (
        set /a ERROR_COUNT+=1
        set "SECTION3_STATUS=FAILED"
        call :color_echo "%RED%" "  X Prettier --write failed"
    ) else (
        call npx prettier --check src public
        if errorlevel 1 (
            set /a ERROR_COUNT+=1
            set "SECTION3_STATUS=FAILED"
            call :color_echo "%RED%" "  X Prettier check still failing after write"
        ) else (
            set "SECTION3_STATUS=WARNING_FIXED"
            call :color_echo "%GREEN%" "  OK Prettier formatted and verified"
        )
    )
) else (
    set "SECTION3_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK Prettier check passed"
)
echo.
goto :eof

:step_04
call :color_echo "%CYAN%" "[4/7] Linting..."
echo ----------------------------------------
if /i "%SKIP_ESLINT%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_ESLINT=1)"
    set "SECTION4_STATUS=SKIPPED"
    echo.
    goto :eof
)
call :color_echo "%YELLOW%" "  Running: npx eslint src"
call npx eslint src
if errorlevel 1 (
    set /a ERROR_COUNT+=1
    set "SECTION4_STATUS=FAILED"
    call :color_echo "%RED%" "  X Linting errors found"
    call npx eslint src --fix
    call npx eslint src
    if not errorlevel 1 (
        set /a ERROR_COUNT-=1
        set "SECTION4_STATUS=WARNING_FIXED"
        call :color_echo "%GREEN%" "  OK Linting issues resolved"
    )
) else (
    set "SECTION4_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK No linting errors"
)
echo.
goto :eof

:step_05
call :color_echo "%CYAN%" "[5/7] Running tests..."
echo ----------------------------------------
call :color_echo "%YELLOW%" "  Running: npm test -- --watchAll=false --passWithNoTests"
call cmd /c "set CI=true&& npm test -- --watchAll=false --passWithNoTests"
if errorlevel 1 (
    set /a ERROR_COUNT+=1
    set "SECTION5_STATUS=FAILED"
    call :color_echo "%RED%" "  X Tests failed"
) else (
    set "SECTION5_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK All tests passed"
)
echo.
goto :eof

:step_05b
if /i not "%RUN_TEST_COVERAGE%"=="1" (
    call :color_echo "%BLUE%" "[5b/7] Coverage skipped (set RUN_TEST_COVERAGE=1 to enable)"
    echo.
    goto :eof
)
call :color_echo "%CYAN%" "[5b/7] Jest coverage (RUN_TEST_COVERAGE=1)..."
echo ----------------------------------------
call cmd /c "set CI=true&& npm test -- --watchAll=false --coverage --passWithNoTests"
if errorlevel 1 (
    set /a WARNING_COUNT+=1
    set "SECTION5_COVERAGE_STATUS=WARNING"
    call :color_echo "%YELLOW%" "  Warning: Coverage run failed or thresholds not met"
) else (
    set "SECTION5_COVERAGE_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK Coverage run completed"
)
echo.
goto :eof

:step_06
call :color_echo "%CYAN%" "[6/7] Production build check..."
echo ----------------------------------------
call :color_echo "%YELLOW%" "  Running: npm run build"
call npm run build
if errorlevel 1 (
    set /a ERROR_COUNT+=1
    set "SECTION6_STATUS=FAILED"
    call :color_echo "%RED%" "  X Build failed"
) else if exist "build\index.html" (
    set "SECTION6_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK Build successful (build\index.html present)"
) else (
    set /a ERROR_COUNT+=1
    set "SECTION6_STATUS=FAILED"
    call :color_echo "%RED%" "  X build\index.html not found"
)
echo.
goto :eof

:step_07
call :color_echo "%CYAN%" "[7/7] Starting development server..."
call :color_echo "%BLUE%" "  Open http://localhost:3000  -  Press Ctrl+C to stop"
echo.
call npm start
goto :eof

:show_summary
echo.
call :color_echo "%CYAN%" "========================================"
call :color_echo "%CYAN%" "  SUMMARY"
call :color_echo "%CYAN%" "========================================"
echo.
call :color_echo "%BLUE%" "Section Status:"
echo   [0] Game asset inventory:             !SECTION0_STATUS!  (glb=!ASSET_GLB_COUNT!)
echo   [1] Cleanup and npm install:          !SECTION1_STATUS!
echo   [2] Type checking (JS - skipped):   !SECTION2_STATUS!
echo   [3] Prettier:                         !SECTION3_STATUS!
echo   [4] ESLint:                           !SECTION4_STATUS!
echo   [5] Jest tests:                       !SECTION5_STATUS!
echo   [5b] Jest coverage:                   !SECTION5_COVERAGE_STATUS!
echo   [6] Build verification:               !SECTION6_STATUS!
echo.
if !ERROR_COUNT! GTR 0 (
    call :color_echo "%RED%" "  X Found !ERROR_COUNT! error(s)"
    if !WARNING_COUNT! GTR 0 call :color_echo "%YELLOW%" "  Found !WARNING_COUNT! warning(s)"
    echo.
    call :color_echo "%YELLOW%" "  Please fix the errors before proceeding."
    goto :eof
)
call :color_echo "%GREEN%" "  OK All checks passed!"
if !WARNING_COUNT! GTR 0 call :color_echo "%YELLOW%" "  Found !WARNING_COUNT! warning(s)"
echo.
if /i "%AUTO_SKIP_DEV%"=="1" goto :eof
if /i "%AUTO_START_DEV%"=="1" (
    set "START_DEV=1"
    goto :eof
)
call :color_echo "%CYAN%" "  Start development server? (Y/N)"
choice /C YN /N /M ""
if !ERRORLEVEL! EQU 1 set "START_DEV=1"
goto :eof
