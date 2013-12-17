wave-form-player
================
PLAYER
    You can find wave form player in action http://wave-form-player.linasziedas.lt/

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



mp3ToWav.php

    Mp3 file converter to Wav
    Input takes 2 parameters:
        - filePath to mp3 file
        - destination to write to (default is current dir)

        command line example:
            $ php mp3ToWav.php Miaow-07-Bubble.mp3 ./dir/name
                - ./Miaow-07-Bubble.mp3 - input mp3 filePath
                - ./dir/name destination name


