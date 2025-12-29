@echo off
echo ========================================
echo Checking Project Readiness for Upload
echo ========================================
echo.

set ERRORS=0

echo [1/5] Checking required files...
if not exist "package.json" (
    echo [X] package.json not found!
    set /a ERRORS+=1
) else (
    echo [OK] package.json found
)

if not exist "server.js" (
    echo [X] server.js not found!
    set /a ERRORS+=1
) else (
    echo [OK] server.js found
)

if not exist "next.config.js" (
    echo [X] next.config.js not found!
    set /a ERRORS+=1
) else (
    echo [OK] next.config.js found
)

echo.
echo [2/5] Checking build files...
if not exist ".next" (
    echo [X] .next folder not found! Run build first.
    set /a ERRORS+=1
) else (
    echo [OK] .next folder found
    
    if not exist ".next\server" (
        echo [X] .next\server folder not found!
        set /a ERRORS+=1
    ) else (
        echo [OK] .next\server folder found
    )
    
    if not exist ".next\static" (
        echo [X] .next\static folder not found!
        set /a ERRORS+=1
    ) else (
        echo [OK] .next\static folder found
    )
    
    if not exist ".next\BUILD_ID" (
        echo [X] .next\BUILD_ID file not found!
        set /a ERRORS+=1
    ) else (
        echo [OK] .next\BUILD_ID file found
    )
)

echo.
echo [3/5] Checking project structure...
if not exist "app" (
    echo [X] app folder not found!
    set /a ERRORS+=1
) else (
    echo [OK] app folder found
)

if not exist "components" (
    echo [X] components folder not found!
    set /a ERRORS+=1
) else (
    echo [OK] components folder found
)

if not exist "lib" (
    echo [X] lib folder not found!
    set /a ERRORS+=1
) else (
    echo [OK] lib folder found
)

if not exist "public" (
    echo [X] public folder not found!
    set /a ERRORS+=1
) else (
    echo [OK] public folder found
)

echo.
echo [4/5] Checking configuration files...
if not exist "tsconfig.json" (
    echo [WARNING] tsconfig.json not found (optional)
) else (
    echo [OK] tsconfig.json found
)

if not exist "tailwind.config.js" (
    echo [WARNING] tailwind.config.js not found (optional)
) else (
    echo [OK] tailwind.config.js found
)

if not exist "postcss.config.js" (
    echo [WARNING] postcss.config.js not found (optional)
) else (
    echo [OK] postcss.config.js found
)

echo.
echo [5/5] Checking documentation...
if not exist "CPANEL_SETUP.md" (
    echo [WARNING] CPANEL_SETUP.md not found
) else (
    echo [OK] CPANEL_SETUP.md found
)

if not exist "QUICK_START.md" (
    echo [WARNING] QUICK_START.md not found
) else (
    echo [OK] QUICK_START.md found
)

echo.
echo ========================================
if %ERRORS% equ 0 (
    echo All checks passed! Project is ready for upload.
    echo.
    echo Files to upload:
    echo - .next folder (complete)
    echo - All project files (except node_modules)
    echo.
    echo See CPANEL_SETUP.md for deployment instructions.
) else (
    echo Found %ERRORS% error(s)! Please fix them before uploading.
    echo.
    if not exist ".next" (
        echo Run build-for-cpanel.bat first to build the project.
    )
)
echo ========================================
echo.
pause

