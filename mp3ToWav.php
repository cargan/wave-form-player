<?php

function main($source, $destination) {
  $destFileName = $destination . ".mp3";
  $output = NULL;
  $return = NULL;
  exec("ffmpeg -y -i {$source} -acodec libmp3lame -ac 1 -ar 8000 -ab 16k $destFileName", $output, $return);
  var_dump($output, $return);
}

var_dump($argv, $argc);
if (($argc != 3) ||  !file_exists($argv[1])) {
    die('invalid arguments specified');
}

main($argv[1], $argv[2]);


