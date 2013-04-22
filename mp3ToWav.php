<?php

function main($source, $destination) {
  $destFileName = $destination . ".mp3";
  $output = NULL;
  $return = NULL;
  $command = "avconv -i $source -b $destFileName";
  exec($command, $output, $return);
  var_dump($output, $return);exit;
}

var_dump($argv, $argc);
if (($argc != 3) ||  !file_exists($argv[1])) {
    die('invalid arguments specified');
}

main($argv[1], $argv[2]);


