@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM =============================================================================
REM Pixelmon graphify.bat - Single codebase graph builder + viewer
REM
REM   graphify                 Default: show graph + check + open graph.html
REM   graphify build           Build the unified codebase graph (extract + bridge)
REM   graphify show            Show graph stats and top connected symbols
REM   graphify check           Validate the generated graph.json
REM   graphify open            Open the graph.html visualization in browser
REM   graphify help            This help
REM =============================================================================

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
cd /d "%ROOT%"

set "GRAPHIFY_EXE="
if exist "%USERPROFILE%\.local\bin\graphify.exe" set "GRAPHIFY_EXE=%USERPROFILE%\.local\bin\graphify.exe"
if not defined GRAPHIFY_EXE (
  for /f "delims=" %%I in ('where graphify.exe 2^>nul') do (
    echo %%I | findstr /i /c:".bat" >nul
    if errorlevel 1 (
      set "GRAPHIFY_EXE=%%I"
      goto :exe_found
    )
  )
)
:exe_found
if not defined GRAPHIFY_EXE (
  echo [graphify.bat] ERROR: graphify.exe not found.
  echo Install:  uv tool install graphifyy
  exit /b 1
)

REM Route Commands
if /i "%~1"=="" goto :dashboard
if /i "%~1"=="dashboard" goto :dashboard
if /i "%~1"=="help" goto :help_all
if /i "%~1"=="-h" goto :help_all
if /i "%~1"=="--help" goto :help_all
if /i "%~1"=="build" goto :build
if /i "%~1"=="show" goto :show
if /i "%~1"=="status" goto :show
if /i "%~1"=="check" goto :check
if /i "%~1"=="open" goto :open_graph

REM Forward other commands to graphify.exe directly (e.g. query, explain)
"%GRAPHIFY_EXE%" %*
exit /b %ERRORLEVEL%

REM =============================================================================
:help_all
echo.
echo Pixelmon graphify CLI (Single Codebase Setup)
echo CLI: %GRAPHIFY_EXE%
echo.
echo Commands:
echo   graphify                    Show dashboard + check + open graph.html
echo   graphify build              Extract codebase AST and run bridging post-process
echo   graphify show               Show graph summary stats and top nodes
echo   graphify check              Validate that graph.json is present and valid
echo   graphify open               Open graph.html in your default web browser
echo   graphify help               This help screen
echo.
echo Query Examples (Forwarded to graphify.exe):
echo   graphify query "world"
echo   graphify explain "useGame"
echo.
exit /b 0

REM =============================================================================
:dashboard
echo.
echo === Pixelmon graphify dashboard ===
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\graphify-lib.ps1" -Action show -Root "%ROOT%"
set "SHOW_RC=%ERRORLEVEL%"
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\graphify-lib.ps1" -Action check -Root "%ROOT%"
set "CHECK_RC=%ERRORLEVEL%"
if "%CHECK_RC%"=="0" (
  echo.
  echo Graph file is OK. Opening visualization...
  powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\graphify-lib.ps1" -Action open -Root "%ROOT%"
) else (
  echo.
  echo Graph file is missing or invalid. Run:  graphify build
)
exit /b %CHECK_RC%

:build
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\graphify-lib.ps1" -Action build -Root "%ROOT%" -GraphifyExe "%GRAPHIFY_EXE%"
exit /b %ERRORLEVEL%

:show
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\graphify-lib.ps1" -Action show -Root "%ROOT%"
exit /b %ERRORLEVEL%

:check
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\graphify-lib.ps1" -Action check -Root "%ROOT%"
exit /b %ERRORLEVEL%

:open_graph
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\graphify-lib.ps1" -Action open -Root "%ROOT%" -GraphifyExe "%GRAPHIFY_EXE%"
exit /b %ERRORLEVEL%
