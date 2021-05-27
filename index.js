const compress_images = require("compress-images");
const INPUT_PATH = "big-images/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
const OUTPUT_PATH = "compressed-images/";

const fs = require("fs");
const original_folder = './original-images/';
const big_images = './big-images/';

const max_sizes = {
    jpg: 200,
    JPG: 200,
    jpeg: 200,
    JPEG: 200,
    gif: 400,
    GIF: 400,
    png: 100,
    PNG: 100,
    svg: 100,
    SVG: 100,
}

const copy_big_images = () => {
    return new Promise((resolve) => {
        fs.readdir(original_folder, (err, files) => {

            files.forEach(file => {

                fs.stat(original_folder + file, (err, stats) => {
                    console.log('Fichero', original_folder + file);
                    const extension = file.slice(file.lastIndexOf('.') + 1, file.length);

                    if (stats.size / 1024 > max_sizes[extension]) {
                        console.log(extension);

                        fs.copyFile(original_folder + file, big_images + file, err => {
                            if (err) throw err;
                            console.log('Hecho');
                            resolve();
                        });
                    }

                });
            });
        });
    });
};

const compress_big_images = () => {
    return new Promise((resolve) => {
        compress_images(INPUT_PATH, OUTPUT_PATH, { compress_force: false, statistic: true, autoupdate: true }, false,
            { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
            { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
            { svg: { engine: "svgo", command: "--multipass" } },
            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
            function (error, completed, statistic) {
                console.log("-------------");
                console.log(error);
                console.log(completed);
                console.log(statistic);
                console.log("-------------");
                resolve();
            }
        );
    });
};

async function do_the_thing() {

    const copy = await copy_big_images();

    if (copy) {
        console.log('Comprimimos imagenes');
        await compress_big_images();
    }

}

do_the_thing();

