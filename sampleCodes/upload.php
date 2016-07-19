<?php
$target_dir = "log/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;


// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded. <br/> &lt;img src=&quot;uploads/". basename( $_FILES["fileToUpload"]["name"]). "&quot;/&gt;";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?> 
<a href="upload.html">back</a>