<?php
header("Content-Type: application/xhtml+xml");
header("X-WebKit-CSP: style-src 'none'; script-src * 'unsafe-inline'");

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<?xml-stylesheet type="text/xsl" href="resources/style.xsl"?>';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<script>
//<![CDATA[
if (window.testRunner)
    testRunner.dumpAsText();
//]]>
</script>
</head>
<body>
The text below should indicate that the style sheet was applied.
<div />
</body>
</html>
