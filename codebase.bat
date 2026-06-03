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
REM Pipeline (always 0-9 in order; step 10 only after summary prompt):
REM   0 assets, 1 clean+install, 2 env check, 3 tsc skip, 4 prettier, 5 eslint,
REM   6 tests, 6b coverage, 7 GLB verify, 8 manifest, 9 build, 10 npm start.
REM
REM Optional: SKIP_ASSET_INVENTORY=1  SKIP_CLEAN=1  SKIP_ENV_CHECK=1
REM           SKIP_PRETTIER=1  RUN_PRETTIER=1  SKIP_ESLINT=1  RUN_TEST_COVERAGE=1
REM           SKIP_GLB_VERIFY=1  SKIP_MANIFEST_CHECK=1  RUN_PIPELINE_PILOT=1
REM           AUTO_START_DEV=1  AUTO_SKIP_DEV=1
REM ========================================

set "ERROR_COUNT=0"
set "WARNING_COUNT=0"
set "MAIN_ABORT=0"
set "START_DEV=0"
set "SECTION6_COVERAGE_STATUS=SKIPPED"
set "PYTHON_EXE="
set "PYTHON_ARGS="
set "POKE_IMG_COUNT=0"
set "POKE_GLB_COUNT=0"
set "SECTION1_STATUS=SKIPPED"
set "SECTION2_STATUS=SKIPPED"
set "SECTION3_STATUS=SKIPPED"
set "SECTION4_STATUS=SKIPPED"
set "SECTION5_STATUS=SKIPPED"
set "SECTION6_STATUS=SKIPPED"
set "SECTION7_STATUS=SKIPPED"
set "SECTION8_STATUS=SKIPPED"
set "SECTION9_STATUS=SKIPPED"

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

call :find_python

REM --- Steps 0-9: strict sequential order ---
call :step_00
call :step_01
if "!MAIN_ABORT!"=="1" goto :after_steps
call :step_02
call :step_02b
call :step_03
call :step_04
call :step_05
call :step_06
call :step_06b
call :step_07
call :step_08
call :step_09

:after_steps
call :show_summary
if "!START_DEV!"=="1" call :step_10

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

:find_python
set "PYTHON_EXE="
set "PYTHON_ARGS="
where python >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=python"
    goto :eof
)
where py >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_EXE=py"
    set "PYTHON_ARGS=-3"
    goto :eof
)
goto :eof

:run_python
if "!PYTHON_EXE!"=="" exit /b 127
if "!PYTHON_ARGS!"=="" (
    call "!PYTHON_EXE!" %*
) else (
    call "!PYTHON_EXE!" !PYTHON_ARGS! %*
)
exit /b !ERRORLEVEL!

:count_assets
set "POKE_IMG_COUNT=0"
set "POKE_GLB_COUNT=0"
if exist "public\poke_img" for /f %%C in ('dir /b "public\poke_img\*.png" 2^>nul ^| find /c /v ""') do set "POKE_IMG_COUNT=%%C"
if exist "public\poke_glb" for /f %%C in ('dir /b "public\poke_glb\*.glb" 2^>nul ^| find /c /v ""') do set "POKE_GLB_COUNT=%%C"
goto :eof

:step_00
if /i "%SKIP_ASSET_INVENTORY%"=="1" (
    call :color_echo "%YELLOW%" "[0/10] Asset inventory skipped (SKIP_ASSET_INVENTORY=1)"
    echo.
    goto :eof
)
call :color_echo "%CYAN%" "[0/10] Asset inventory..."
echo ----------------------------------------
call :color_echo "%BLUE%" "  Counts PNG sprites (public\poke_img) and GLB models (public\poke_glb)."
call :count_assets
call :color_echo "%BLUE%" "  poke_img PNG files: !POKE_IMG_COUNT!"
call :color_echo "%BLUE%" "  poke_glb GLB files: !POKE_GLB_COUNT!"
if exist "public\poke_glb\manifest.json" (
    call :color_echo "%GREEN%" "  OK manifest.json present"
) else (
    call :color_echo "%YELLOW%" "  ! manifest.json missing (run: python scripts\generate_manifest.py)"
)
if exist "scripts\conversion_errors.json" (
    call :color_echo "%YELLOW%" "  ! scripts\conversion_errors.json exists (prior pipeline failures logged)"
)
echo.
goto :eof

:step_01
call :color_echo "%CYAN%" "[1/10] Cleaning and preparing..."
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
if /i "%SKIP_ENV_CHECK%"=="1" (
    call :color_echo "%YELLOW%" "[2/10] Environment check skipped (SKIP_ENV_CHECK=1)"
    set "SECTION2_STATUS=SKIPPED"
    echo.
    goto :eof
)
call :color_echo "%CYAN%" "[2/10] Python / WSL pipeline environment..."
echo ----------------------------------------
call :color_echo "%BLUE%" "  Diagnoses WSL Ubuntu, conda trellis env, GPU VRAM, pilot GLBs."
if "!PYTHON_EXE!"=="" (
    set /a WARNING_COUNT+=1
    set "SECTION2_STATUS=WARNING"
    call :color_echo "%YELLOW%" "  ! Python not found on PATH (skipped check_environment.py)"
) else (
    call :color_echo "%YELLOW%" "  Running: !PYTHON_EXE! !PYTHON_ARGS! scripts\check_environment.py"
    call :run_python scripts\check_environment.py
    if errorlevel 1 (
        set /a WARNING_COUNT+=1
        set "SECTION2_STATUS=WARNING"
        call :color_echo "%YELLOW%" "  ! Environment check reported issues (warn-only; app may still run)"
    ) else (
        set "SECTION2_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK Pipeline environment ready"
    )
)
echo.
goto :eof

:step_02b
if /i not "%RUN_PIPELINE_PILOT%"=="1" goto :eof
call :color_echo "%CYAN%" "[2b/10] Pilot GLB pipeline (RUN_PIPELINE_PILOT=1)..."
echo ----------------------------------------
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\run_pipeline.ps1" -PilotOnly
if errorlevel 1 (
    set /a WARNING_COUNT+=1
    call :color_echo "%YELLOW%" "  ! Pilot pipeline exited with error (see scripts\TROUBLESHOOTING.md)"
) else (
    call :color_echo "%GREEN%" "  OK Pilot pipeline finished"
)
echo.
goto :eof

:step_03
call :color_echo "%CYAN%" "[3/10] Type checking..."
echo ----------------------------------------
call :color_echo "%BLUE%" "  Skipped: JavaScript Create React App project (no TypeScript / tsc)."
set "SECTION3_STATUS=SKIPPED"
echo.
goto :eof

:step_04
call :color_echo "%CYAN%" "[4/10] Prettier (format check)..."
echo ----------------------------------------
if /i "%SKIP_PRETTIER%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_PRETTIER=1)"
    set "SECTION4_STATUS=SKIPPED"
    echo.
    goto :eof
)
if not exist ".prettierrc" if not exist ".prettierrc.json" if not exist ".prettierrc.js" if /i not "%RUN_PRETTIER%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (no .prettierrc; set RUN_PRETTIER=1 to run anyway)"
    set "SECTION4_STATUS=SKIPPED"
    echo.
    goto :eof
)
call :color_echo "%YELLOW%" "  Running: npx prettier --check src public scripts"
call npx prettier --check src public scripts
if errorlevel 1 (
    set /a WARNING_COUNT+=1
    call npx prettier --write src public scripts
    if errorlevel 1 (
        set /a ERROR_COUNT+=1
        set "SECTION4_STATUS=FAILED"
        call :color_echo "%RED%" "  X Prettier --write failed"
    ) else (
        call npx prettier --check src public scripts
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
echo.
goto :eof

:step_05
call :color_echo "%CYAN%" "[5/10] Linting..."
echo ----------------------------------------
if /i "%SKIP_ESLINT%"=="1" (
    call :color_echo "%YELLOW%" "  Skipped (SKIP_ESLINT=1)"
    set "SECTION5_STATUS=SKIPPED"
    echo.
    goto :eof
)
call :color_echo "%YELLOW%" "  Running: npx eslint src"
call npx eslint src
if errorlevel 1 (
    set /a ERROR_COUNT+=1
    set "SECTION5_STATUS=FAILED"
    call :color_echo "%RED%" "  X Linting errors found"
    call npx eslint src --fix
    call npx eslint src
    if not errorlevel 1 (
        set /a ERROR_COUNT-=1
        set "SECTION5_STATUS=WARNING_FIXED"
        call :color_echo "%GREEN%" "  OK Linting issues resolved"
    )
) else (
    set "SECTION5_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK No linting errors"
)
echo.
goto :eof

:step_06
call :color_echo "%CYAN%" "[6/10] Running tests..."
echo ----------------------------------------
call :color_echo "%YELLOW%" "  Running: npm test -- --watchAll=false --passWithNoTests"
call cmd /c "set CI=true&& npm test -- --watchAll=false --passWithNoTests"
if errorlevel 1 (
    set /a ERROR_COUNT+=1
    set "SECTION6_STATUS=FAILED"
    call :color_echo "%RED%" "  X Tests failed"
) else (
    set "SECTION6_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK All tests passed"
)
echo.
goto :eof

:step_06b
if /i not "%RUN_TEST_COVERAGE%"=="1" (
    call :color_echo "%BLUE%" "[6b/10] Coverage skipped (set RUN_TEST_COVERAGE=1 to enable)"
    echo.
    goto :eof
)
call :color_echo "%CYAN%" "[6b/10] Jest coverage (RUN_TEST_COVERAGE=1)..."
echo ----------------------------------------
call cmd /c "set CI=true&& npm test -- --watchAll=false --coverage --passWithNoTests"
if errorlevel 1 (
    set /a WARNING_COUNT+=1
    set "SECTION6_COVERAGE_STATUS=WARNING"
    call :color_echo "%YELLOW%" "  Warning: Coverage run failed or thresholds not met"
) else (
    set "SECTION6_COVERAGE_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK Coverage run completed"
)
echo.
goto :eof

:step_07
if /i "%SKIP_GLB_VERIFY%"=="1" (
    call :color_echo "%YELLOW%" "[7/10] GLB verification skipped (SKIP_GLB_VERIFY=1)"
    set "SECTION7_STATUS=SKIPPED"
    echo.
    goto :eof
)
call :color_echo "%CYAN%" "[7/10] Pilot GLB asset verification..."
echo ----------------------------------------
if "!PYTHON_EXE!"=="" (
    set /a WARNING_COUNT+=1
    set "SECTION7_STATUS=WARNING"
    call :color_echo "%YELLOW%" "  ! Python not found (skipped verify_poke_glbs.py)"
) else (
    call :run_python scripts\verify_poke_glbs.py
    if errorlevel 1 (
        set /a WARNING_COUNT+=1
        set "SECTION7_STATUS=WARNING"
        call :color_echo "%YELLOW%" "  ! Pilot GLBs missing or incomplete (warn-only)"
    ) else (
        set "SECTION7_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK Pilot GLBs verified"
    )
)
echo.
goto :eof

:step_08
if /i "%SKIP_MANIFEST_CHECK%"=="1" (
    call :color_echo "%YELLOW%" "[8/10] Manifest check skipped (SKIP_MANIFEST_CHECK=1)"
    set "SECTION8_STATUS=SKIPPED"
    echo.
    goto :eof
)
call :color_echo "%CYAN%" "[8/10] GLB manifest sanity check..."
echo ----------------------------------------
if not exist "public\poke_glb\manifest.json" (
    set /a WARNING_COUNT+=1
    set "SECTION8_STATUS=WARNING"
    call :color_echo "%YELLOW%" "  ! public\poke_glb\manifest.json not found"
    if not "!PYTHON_EXE!"=="" call :run_python scripts\generate_manifest.py
) else if not "!PYTHON_EXE!"=="" (
    call :run_python -c "import json; json.load(open('public/poke_glb/manifest.json', encoding='utf-8'))"
    if errorlevel 1 (
        set /a WARNING_COUNT+=1
        set "SECTION8_STATUS=WARNING"
        call :color_echo "%YELLOW%" "  ! manifest.json is not valid JSON"
    ) else (
        set "SECTION8_STATUS=PASSED"
        call :color_echo "%GREEN%" "  OK manifest.json is valid JSON"
    )
) else (
    set "SECTION8_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK manifest.json exists"
)
echo.
goto :eof

:step_09
call :color_echo "%CYAN%" "[9/10] Production build check..."
echo ----------------------------------------
call :color_echo "%YELLOW%" "  Running: npm run build"
call npm run build
if errorlevel 1 (
    set /a ERROR_COUNT+=1
    set "SECTION9_STATUS=FAILED"
    call :color_echo "%RED%" "  X Build failed"
) else if exist "build\index.html" (
    set "SECTION9_STATUS=PASSED"
    call :color_echo "%GREEN%" "  OK Build successful (build\index.html present)"
) else (
    set /a ERROR_COUNT+=1
    set "SECTION9_STATUS=FAILED"
    call :color_echo "%RED%" "  X build\index.html not found"
)
echo.
goto :eof

:step_10
call :color_echo "%CYAN%" "[10/10] Starting development server..."
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
echo   [0] Asset inventory:                  poke_img=!POKE_IMG_COUNT!  poke_glb=!POKE_GLB_COUNT!
echo   [1] Cleanup and npm install:          !SECTION1_STATUS!
echo   [2] Python/WSL environment:           !SECTION2_STATUS!
echo   [3] Type checking (JS - skipped):     !SECTION3_STATUS!
echo   [4] Prettier:                         !SECTION4_STATUS!
echo   [5] ESLint:                           !SECTION5_STATUS!
echo   [6] Jest tests:                       !SECTION6_STATUS!
echo   [6b] Jest coverage:                   !SECTION6_COVERAGE_STATUS!
echo   [7] Pilot GLB verification:           !SECTION7_STATUS!
echo   [8] Manifest check:                   !SECTION8_STATUS!
echo   [9] Build verification:               !SECTION9_STATUS!
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
