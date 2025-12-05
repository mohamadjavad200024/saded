@echo off
REM Script to reset PostgreSQL password
REM This script modifies pg_hba.conf to allow passwordless connection temporarily

echo ========================================
echo PostgreSQL Password Reset Script
echo ========================================
echo.
echo This script will:
echo 1. Find pg_hba.conf file
echo 2. Temporarily change authentication to 'trust'
echo 3. Restart PostgreSQL service
echo 4. Allow you to change password
echo 5. Restore original settings
echo.
pause

REM Find PostgreSQL data directory
set "PG_DATA="
if exist "C:\Program Files\PostgreSQL\16\data\pg_hba.conf" (
    set "PG_DATA=C:\Program Files\PostgreSQL\16\data"
    set "PG_VERSION=16"
) else if exist "C:\Program Files\PostgreSQL\15\data\pg_hba.conf" (
    set "PG_DATA=C:\Program Files\PostgreSQL\15\data"
    set "PG_VERSION=15"
) else if exist "C:\Program Files\PostgreSQL\14\data\pg_hba.conf" (
    set "PG_DATA=C:\Program Files\PostgreSQL\14\data"
    set "PG_VERSION=14"
) else (
    echo ERROR: Could not find PostgreSQL data directory
    echo Please find pg_hba.conf manually and edit it
    pause
    exit /b 1
)

echo Found PostgreSQL %PG_VERSION% at: %PG_DATA%
echo.

REM Backup pg_hba.conf
echo Creating backup...
copy "%PG_DATA%\pg_hba.conf" "%PG_DATA%\pg_hba.conf.backup" >nul
echo Backup created: pg_hba.conf.backup
echo.

REM Modify pg_hba.conf (this is a simple approach - you may need to edit manually)
echo IMPORTANT: You need to manually edit pg_hba.conf
echo.
echo 1. Open: %PG_DATA%\pg_hba.conf
echo 2. Find line with: host    all             all             127.0.0.1/32
echo 3. Change the last word from 'scram-sha-256' to 'trust'
echo 4. Save the file
echo 5. Press any key to continue...
pause

REM Restart PostgreSQL service
echo.
echo Restarting PostgreSQL service...
net stop "postgresql-x64-%PG_VERSION%"
timeout /t 2 /nobreak >nul
net start "postgresql-x64-%PG_VERSION%"
timeout /t 3 /nobreak >nul
echo.

REM Connect and change password
echo Connecting to PostgreSQL...
echo You should now be able to connect without password
echo.
psql -U postgres -c "ALTER USER postgres PASSWORD 'saded';"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Password changed to 'saded' successfully!
    echo.
    echo Now restore pg_hba.conf:
    echo 1. Open: %PG_DATA%\pg_hba.conf
    echo 2. Change 'trust' back to 'scram-sha-256'
    echo 3. Save the file
    echo 4. Press any key to restart PostgreSQL...
    pause
    
    net stop "postgresql-x64-%PG_VERSION%"
    timeout /t 2 /nobreak >nul
    net start "postgresql-x64-%PG_VERSION%"
    
    echo.
    echo ✅ Done! You can now use password 'saded'
) else (
    echo.
    echo ❌ Failed to change password
    echo You may need to run psql manually:
    echo   psql -U postgres
    echo   ALTER USER postgres PASSWORD 'saded';
)

echo.
pause

