function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var base64Data = data.file;
    var fileName = data.name;
    var mimeType = data.type;
    
    // معرف المجلد الخاص بك في جوجل درايف
    var folderId = "10ENiX9zYi3LGUwE_716WAP_rqGLReDUr"; 
    var folder = DriveApp.getFolderById(folderId);
    
    // فك التشفير وحويل الصورة إلى ملف
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    var file = folder.createFile(blob);
    
    // جعل الملف قابلاً للقراءة العامة ليظهر في الموقع
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    var directLink = "https://lh3.googleusercontent.com/d/" + fileId;
    
    var output = JSON.stringify({ "status": "success", "link": directLink });
    
    // حل مشكلة الـ CORS نهائياً عن طريق إنشاء النص كـ HtmlTemplate
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    var errorOutput = JSON.stringify({ "status": "error", "message": error.toString() });
    return ContentService.createTextOutput(errorOutput).setMimeType(ContentService.MimeType.JSON);
  }
}

// إضافة دالة OPTIONS للتعامل مع طلبات المتصفح المسبقة بأمان
function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}
