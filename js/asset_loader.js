const ASSET_TYPE = Object.freeze({
    image: Symbol(),
    audio: Symbol(),
})

const aa = [
    'assets/audio/calm1.ogg',
    'assets/audio/calm2.ogg',
    'assets/audio/calm3.ogg',
    'assets/audio/piano1.ogg',
    'assets/audio/piano2.ogg',
    'assets/audio/piano3.ogg',
]

const block_sounds = {
    bamboo: [
        './assets/audio/sounds/bamboo/place1.ogg',
        './assets/audio/sounds/bamboo/place2.ogg',
        './assets/audio/sounds/bamboo/place3.ogg',
        './assets/audio/sounds/bamboo/place4.ogg',
        './assets/audio/sounds/bamboo/place5.ogg',
        './assets/audio/sounds/bamboo/place6.ogg',
    ],
    copper: [
        './assets/audio/sounds/copper/break1.ogg',
        './assets/audio/sounds/copper/break2.ogg',
        './assets/audio/sounds/copper/break3.ogg',
        './assets/audio/sounds/copper/break4.ogg',
        './assets/audio/sounds/copper/step1.ogg',
        './assets/audio/sounds/copper/step2.ogg',
        './assets/audio/sounds/copper/step3.ogg',
        './assets/audio/sounds/copper/step4.ogg',
        './assets/audio/sounds/copper/step5.ogg',
        './assets/audio/sounds/copper/step6.ogg',
    ],
    grass: [
        './assets/audio/sounds/grass/grass1.ogg',
        './assets/audio/sounds/grass/grass2.ogg',
        './assets/audio/sounds/grass/grass3.ogg',
        './assets/audio/sounds/grass/grass4.ogg',
    ],
    gravel: [
        './assets/audio/sounds/gravel/gravel1.ogg',
        './assets/audio/sounds/gravel/gravel2.ogg',
        './assets/audio/sounds/gravel/gravel3.ogg',
        './assets/audio/sounds/gravel/gravel4.ogg',
    ],
    sand: [
        './assets/audio/sounds/sand/sand1.ogg',
        './assets/audio/sounds/sand/sand2.ogg',
        './assets/audio/sounds/sand/sand3.ogg',
        './assets/audio/sounds/sand/sand4.ogg',
    ],
    stone: [
        './assets/audio/sounds/stone/stone1.ogg',
        './assets/audio/sounds/stone/stone2.ogg',
        './assets/audio/sounds/stone/stone3.ogg',
        './assets/audio/sounds/stone/stone4.ogg',
    ],
    wood: [
        './assets/audio/sounds/wood/wood1.ogg',
        './assets/audio/sounds/wood/wood2.ogg',
        './assets/audio/sounds/wood/wood3.ogg',
        './assets/audio/sounds/wood/wood4.ogg',
    ]
}

const misc_sounds = {
    line: './assets/audio/sounds/misc/orb.ogg',
    level_up: './assets/audio/sounds/misc/levelup.ogg'
}

const ia = [
    "./assets/images/blocks/bamboo_block.png",
    "./assets/images/blocks/chiseled_stone_bricks.png",
    "./assets/images/blocks/grass_block_side.png",
    "./assets/images/blocks/oxidized_cut_copper.png",
    "./assets/images/blocks/sand.png",
    "./assets/images/blocks/gravel.png",
    "./assets/images/blocks/spruce_planks.png"
]

export const assets = {
    l_image: {
        type: ASSET_TYPE.image,
        url: ia[0],
        color: "#cc6600"
    },
    j_image: {
        type: ASSET_TYPE.image,
        url: ia[1],
        color: "#0000cc"
    },
    s_image: {
        type: ASSET_TYPE.image,
        url: ia[2],
        color: "#00cc00"
    },
    z_image: {
        type: ASSET_TYPE.image,
        url: ia[3],
        color: "#cc0000"
    },
    o_image: {
        type: ASSET_TYPE.image,
        url: ia[4],
        color: "#cccc00"
    },
    i_image: {
        type: ASSET_TYPE.image,
        url: ia[5],
        color: "#00cdcd"
    },
    t_image: {
        type: ASSET_TYPE.image,
        url: ia[6],
        color: "#9900cc"
    },
    music_1: {
        type: ASSET_TYPE.audio,
        url: aa[0]
    },
    music_2: {
        type: ASSET_TYPE.audio,
        url: aa[1]
    },
    music_3: {
        type: ASSET_TYPE.audio,
        url: aa[2]
    },
    music_4: {
        type: ASSET_TYPE.audio,
        url: aa[3]
    },
    music_5: {
        type: ASSET_TYPE.audio,
        url: aa[4]
    },
    music_6: {
        type: ASSET_TYPE.audio,
        url: aa[5]
    },
    ...(() => {
        const n = {};
        Object.entries(block_sounds).forEach(([key, val]) => {
            val.forEach((file, i) => {
                n[key + '_' + i] = {
                    type: ASSET_TYPE.audio,
                    url: file
                }
            })
        })
        return n;
    })(),
    ...(() => {
        const n = {}
        const exp = misc_sounds.line;
        for (let i = 0; i < 7; i++) {
            n['line_' + i] = {
                type: ASSET_TYPE.audio,
                url: exp, 
                pitch: .55 + (i / 10),
            }
        }
        return n
    })(),
    lup: {
        type: ASSET_TYPE.audio,
        url: misc_sounds.level_up
    },

}

export const get_sounds = (prefix) => {
    return Object.entries(assets).filter(([name, val]) => name.startsWith(prefix)).map(([_, val]) => val);
}

const load_asset = ({type, url, ...ee}) => {
    return new Promise((res, rej) => {
        if(type === ASSET_TYPE.image){
            const img = new Image();
            img.src = url;
            img.onload = (e) => res(img);
            img.onerror = (e) => rej(e);
            return;
        }
        if(type === ASSET_TYPE.audio){
            const audio = new Audio(url);
            if(ee.pitch){
                audio.mozPreservesPitch = false;
                audio.playbackRate = ee.pitch;
            }
            audio.addEventListener("canplaythrough", (event) => {
                res(audio);
            });
            return;
        }
    })
}

const loadStatus = {
    assets_loaded: 0,
    assets_failed: 0,
    assets_to_load: Object.keys(assets).length,
}


export const load_assets = async (onUpdate) => {
    return Promise.all(Object.entries(assets).map(([key, val]) => new Promise((resolve, reject) => {
        load_asset(val).then(e => {
            val['asset'] = e;
            resolve(val)
            loadStatus.assets_loaded++;
            onUpdate(loadStatus);
        }).catch(e => {
            loadStatus.assets_failed++;
            val['asset'] = null;
            reject(val)
            onUpdate(loadStatus);
        })
    })))
}
