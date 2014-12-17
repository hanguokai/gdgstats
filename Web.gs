function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate().setTitle('GDG Events Statistic Lookup').setSandboxMode(HtmlService.SandboxMode.NATIVE);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}