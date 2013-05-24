<?php
define('ZOOM', 1);                 // Image is drawn ZOOM times bigger and then resized
define('ACCURACY', 100);           // Data point is the average of ACCURACY points in the data block
define('WIDTH', 3000);             // image width
define('HEIGHT', 100);             // image heigt
define('FOREGROUND', '#FAA732');
define('BACKGROUND', '');  //  blank for transparent

function makeWaveData($wavfilename, $destination = "./", $jsonName = false) {
    if (!file_exists($wavfilename)) {
      die('wave does not exists');
    }

    $width = WIDTH;
    if (!$jsonName) {
      $jsonName = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 10) . '.json';
    }

    $dataArray = array();
    $handle = fopen($wavfilename, "rb");
    if (!$handle) {
      die('no file handle');
    }

    $heading[] = fread ($handle, 4);
    $heading[] = bin2hex(fread ($handle, 4));
    $heading[] = fread ($handle, 4);
    $heading[] = fread ($handle, 4);
    $heading[] = bin2hex(fread ($handle, 4));
    $heading[] = bin2hex(fread ($handle, 2));
    $heading[] = bin2hex(fread ($handle, 2));
    $heading[] = bin2hex(fread ($handle, 4));
    $heading[] = bin2hex(fread ($handle, 4));
    $heading[] = bin2hex(fread ($handle, 2));
    $heading[] = bin2hex(fread ($handle, 2));
    $heading[] = fread ($handle, 4);
    $heading[] = bin2hex(fread ($handle, 4));

    // if ($heading[5] != '0100') die("ERROR: wave file should be a PCM file");

    $peek = hexdec(substr($heading[10], 0, 2));
    $byte = $peek / 8;
    $channel = hexdec(substr($heading[6], 0, 2));

    // point = one data point (pixel), WIDTH * ZOOM total
    // block = one block, there are $accuracy blocks per point
    // chunk = one data point 8 or 16 bit, mono or stereo
    $filesize  = filesize($wavfilename);
    $chunksize = $byte * $channel;

    if (!$chunksize) {
        die('something wrong with Chunk size');
    }

    $file_chunks = ($filesize - 44) / $chunksize;
    if ($file_chunks < $width*ZOOM) { $width = $file_chunks; /*die("ERROR: wave file has $file_chunks chunks, ".(WIDTH*ZOOM)." required."); */}
    if ($file_chunks < $width*ZOOM*ACCURACY) $accuracy = 1; else $accuracy = ACCURACY;
    $point_chunks = $file_chunks/ ($width*ZOOM);
    $block_chunks = $file_chunks/ ($width*ZOOM*$accuracy);

    $blocks = array();
    $points = 0;
    $current_file_position = 44.0; // float, because chunks/point and clunks/block are floats too.
    fseek($handle, 44);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Read the data points and draw the image
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    while(!feof($handle)) {
        // The next file position is the float value rounded to the closest chunk
        // Read the next block, take the first value (of the first channel)
        $real_pos_diff = @(($current_file_position-44) % $chunksize);
        if ($real_pos_diff > ($chunksize/2)) $real_pos_diff -= $chunksize;
        fseek($handle, $current_file_position - $real_pos_diff);

        $chunk = fread($handle, $chunksize);
        if (feof($handle) && !strlen($chunk)) break;

        $current_file_position += $block_chunks * $chunksize;

        if ($byte == 1)
            $blocks[] = ord($chunk[0]); // 8 bit
        else
            $blocks[] = ord($chunk[1]) ^ 128; // 16 bit
        // Do we have enough blocks for the current point?
        if (count($blocks) >= $accuracy) {
            // Calculate the mean and add the peak value to the array of blocks
            sort($blocks);
            $mean = (count($blocks) % 2) ? $blocks[(count($blocks)-1) / 2]
                                         : ($blocks[count($blocks) / 2] + $blocks[count($blocks) / 2 - 1]) / 2
                                         ;
          if ($mean > 127) $point = array_pop($blocks); else $point = array_shift($blocks);

            $lineheight = round($point / 255 * HEIGHT*ZOOM);
            $dataArray[] = $lineheight;
            $points++;
            $blocks = array();
        }
    }
    // close wave file
    fclose ($handle);

    if (!file_exists($destination)) {
        mkdir($destination);
    }

    file_put_contents($destination . $jsonName, json_encode($dataArray));
}


if (($argc < 3) ||  !file_exists($argv[1])) {
    die('invalid file specified, need argument being a .wav file');
}
$jsonName = isset($argv[3]) ? $argv[3] : basename($argv[1], ".wav") . '.json';
//wavefile, destination, json_name
makeWaveData($argv[1], $argv[2], $jsonName);


