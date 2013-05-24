wave-form-player
================

waveToJson.php

    Wave file converted to JSON array;
    Input takes 3 parameters:
        - filePath to wave file
        - destination to write to (default is current dir)
        - filename to write to destination (optional)

        command line example:
            $ php waveToJson.php ./sound.wav ./ JsonDataArary.json
                - ./sound.wav - input wave filePath
                - ./ destination dir
                - JsonDataArary.json output file name

