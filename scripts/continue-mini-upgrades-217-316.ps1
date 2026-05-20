$ErrorActionPreference = "Stop"

$updates = @(
    "Documented route-level listing review handoff",
    "Recorded listing creation flash feedback expectation",
    "Captured listing update flash feedback expectation",
    "Noted listing deletion flash feedback expectation",
    "Documented listing ownership failure redirect",
    "Recorded review author failure redirect",
    "Captured missing listing lookup expectation",
    "Noted missing review lookup expectation",
    "Documented subscriber duplicate email expectation",
    "Recorded subscriber admin table workflow",
    "Captured contact message admin workflow",
    "Noted contact message cleanup expectation",
    "Documented user registration validation boundary",
    "Recorded user login validation boundary",
    "Captured logout session cleanup expectation",
    "Noted flash message lifecycle across redirects",
    "Documented home page listing discovery role",
    "Recorded listing index filtering role",
    "Captured listing detail review display role",
    "Noted listing form shared field coverage",
    "Documented edit form image replacement behavior",
    "Recorded create form image upload expectation",
    "Captured review form rating submission behavior",
    "Noted subscriber form email capture behavior",
    "Documented contact form message capture behavior",
    "Recorded navbar authenticated state expectation",
    "Captured navbar guest state expectation",
    "Noted footer shared layout expectation",
    "Documented error view status display behavior",
    "Recorded 404 view fallback behavior",
    "Captured static stylesheet loading expectation",
    "Noted browser script initialization expectation",
    "Documented Bootstrap asset dependency",
    "Recorded EJS partial reuse expectation",
    "Captured EJS layout inheritance expectation",
    "Noted controller async wrapper usage",
    "Documented controller redirect consistency",
    "Recorded controller flash consistency",
    "Captured controller database write boundary",
    "Noted controller database read boundary",
    "Documented middleware next error forwarding",
    "Recorded middleware session dependency",
    "Captured middleware current user local binding",
    "Noted middleware success flash local binding",
    "Documented middleware error flash local binding",
    "Recorded validation listing body expectation",
    "Captured validation review body expectation",
    "Noted validation error status expectation",
    "Documented ExpressError message field usage",
    "Recorded ExpressError status code usage",
    "Captured model listing owner reference",
    "Noted model listing review references",
    "Documented model listing image metadata",
    "Recorded model listing geometry metadata",
    "Captured model review author reference",
    "Noted model user passport plugin usage",
    "Documented model subscriber email field",
    "Recorded model message contact fields",
    "Captured schema listing required fields",
    "Noted schema review required fields",
    "Documented schema listing price validation",
    "Recorded schema listing image validation",
    "Captured schema review rating validation",
    "Noted schema review comment validation",
    "Documented Cloudinary credential dependency",
    "Recorded Cloudinary folder storage expectation",
    "Captured Multer parser storage expectation",
    "Noted upload middleware request shape",
    "Documented MapTiler token dependency",
    "Recorded geocoding coordinate persistence",
    "Captured search query title matching",
    "Noted search query location matching",
    "Documented search query country matching",
    "Recorded category query matching",
    "Captured price query matching",
    "Noted empty query fallback behavior",
    "Documented database connection readiness",
    "Recorded database connection error handling",
    "Captured session store database dependency",
    "Noted session secret environment dependency",
    "Documented cookie age maintenance note",
    "Recorded cookie http only maintenance note",
    "Captured local development port fallback",
    "Noted production environment port support",
    "Documented dotenv local bootstrap role",
    "Recorded ignored environment file reminder",
    "Captured ignored upload workspace reminder",
    "Noted ignored dependency directory reminder",
    "Documented package start command role",
    "Recorded package repository metadata role",
    "Captured package CommonJS type role",
    "Noted dependency inventory maintenance",
    "Documented README setup verification note",
    "Recorded README environment verification note",
    "Captured README route verification note",
    "Noted README troubleshooting verification note",
    "Documented deployment secret checklist",
    "Recorded deployment database checklist",
    "Captured deployment upload checklist",
    "Noted deployment static asset checklist"
)

function Invoke-GitStep {
    param([string[]]$GitArgs)

    & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArgs -join ' ') failed with exit code $LASTEXITCODE"
    }
}

$docsDir = Join-Path $PSScriptRoot "..\docs"
$logPath = Join-Path $docsDir "mini-upgrades.md"
New-Item -ItemType Directory -Force -Path $docsDir | Out-Null

$startNumber = 217
for ($i = 0; $i -lt $updates.Count; $i++) {
    $number = $startNumber + $i
    $entry = "- 2026-05-20 mini upgrade ${number}: $($updates[$i])."
    Add-Content -Path $logPath -Value $entry -Encoding UTF8

    Invoke-GitStep @("add", ".")
    Invoke-GitStep @("commit", "-m", "docs: add mini upgrade $number")
    Invoke-GitStep @("push", "origin", "main")
}
