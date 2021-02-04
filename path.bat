@ECHO OFF >NUL
SETLOCAL enableextensions
set "HKCU_type=REG_EXPAND_SZ"
set "HKCU_path="
for /F "tokens=1,2*" %%F in ('
  reg query HKCU\Environment /v Path 2^>NUL ^|findstr /I "path"
  ') do (
    echo %%H
      ) 
:endlocal
ENDLOCAL
goto :eof
