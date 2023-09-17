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

const ia = [
    "./assets/images/blocks/bamboo_block.png",
    "./assets/images/blocks/chiseled_stone_bricks.png",
    "./assets/images/blocks/grass_block_side.png",
    "./assets/images/blocks/oxidized_cut_copper.png",
    "./assets/images/blocks/sand.png",
    "./assets/images/blocks/sponge.png",
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
}

const load_asset = ({type, url}) => {
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
