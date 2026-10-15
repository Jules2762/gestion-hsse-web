export type FontSizeOption = 'compact' | 'standard' | 'large'

export const FONT_SIZES: Record<FontSizeOption, { label: string; desc: string; sizePx: string }> = {
    compact: {
        label: 'Compacte (13px)',
        desc: 'Style identique à la page profil, idéal pour maximiser l’affichage des données.',
        sizePx: '13px'
    },
    standard: {
        label: 'Standard (14.5px)',
        desc: 'Équilibre parfait entre confort de lecture et compacité des tableaux.',
        sizePx: '14.5px'
    },
    large: {
        label: 'Grande (16px)',
        desc: 'Taille agrandie offrant une lisibilité maximale pour les grands écrans.',
        sizePx: '16px'
    }
}

export function applyFontSize(size: FontSizeOption | string) {
    const validSize: FontSizeOption = (size in FONT_SIZES) ? (size as FontSizeOption) : 'compact'
    const sizeConfig = FONT_SIZES[validSize]

    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-font-size', validSize)
        document.documentElement.style.fontSize = sizeConfig.sizePx
        try {
            localStorage.setItem('galana_font_size', validSize)
        } catch {
            // ignore
        }
    }
}

export function getStoredFontSize(): FontSizeOption {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('galana_font_size') as FontSizeOption
        if (stored && stored in FONT_SIZES) {
            return stored
        }
    }
    return 'compact'
}

export function initFontSize() {
    const size = getStoredFontSize()
    applyFontSize(size)
}
