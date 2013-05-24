<?php

function main($source, $destination)
{
  $destFileName = $destination . ".wav";
  $output = NULL;
  $return = NULL;
  $command = "avconv -i $source $destFileName";
  exec($command, $output, $return);
}

if (($argc != 3) || !file_exists($argv[1])) {
    die('invalid arguments specified');
}

main($argv[1], $argv[2]);


