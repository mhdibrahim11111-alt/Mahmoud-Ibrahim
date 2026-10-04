param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$ProjectId,

  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$DatabaseId,

  [ValidatePattern('^([1-9]|1[0-4])(d|w)$')]
  [string]$Retention = '14d'
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  throw 'ثبّت Google Cloud CLI وسجّل الدخول قبل إنشاء جدول النسخ الاحتياطي.'
}

$listOutput = & gcloud firestore backups schedules list `
  "--project=$ProjectId" `
  "--database=$DatabaseId" `
  '--format=json'
if ($LASTEXITCODE -ne 0) {
  throw 'تعذر قراءة جداول النسخ الحالية. تحقق من المشروع وقاعدة البيانات وصلاحية حساب Google Cloud.'
}

$existingSchedules = @()
if ($listOutput) {
  $existingSchedules = @($listOutput | ConvertFrom-Json)
}
if ($existingSchedules | Where-Object { $_.dailyRecurrence }) {
  Write-Output 'يوجد بالفعل جدول نسخ احتياطي يومي لهذه القاعدة؛ لم يتم إنشاء جدول مكرر.'
  return
}

& gcloud firestore backups schedules create `
  "--project=$ProjectId" `
  "--database=$DatabaseId" `
  "--retention=$Retention" `
  '--recurrence=daily'
if ($LASTEXITCODE -ne 0) {
  throw 'فشل إنشاء جدول النسخ الاحتياطي اليومي.'
}

Write-Output "تم إنشاء نسخ احتياطي يومي مع الاحتفاظ لمدة $Retention."
