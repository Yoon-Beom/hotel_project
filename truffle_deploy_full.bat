@echo off
:: BatchGotAdmin
:-------------------------------------
REM  --> 권한 확인
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> 관리자 권한이 없으면 관리자 권한 요청
if '%errorlevel%' NEQ '0' (
    echo 관리자 권한 요청 중...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

REM Truffle 컴파일, 마이그레이션 실행 및 파일 복사
start cmd.exe /k "cd /d %~dp0 && truffle compile && truffle migrate && xcopy /y build\contracts\HotelBooking.json client\src\contracts\"

echo 작업이 완료되었습니다.

