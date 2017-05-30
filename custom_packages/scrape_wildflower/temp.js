const result = [];

const csvs = [
    "Ailanthus_altissima",
    "Albizia_julibrissin",
    "Allium_vineale",
    "Alternanthera_philoxeroides",
    "Arundo_donax",
    "Bothriochloa_ischaemum_var_songarica",
    "Bromus_arvensis",
    "Broussonetia_papyrifera",
    "Centaurea_melitensis",
    "Cinnamomum_camphora",
    "Clerodendrum_bungei",
    "Colocasia_esculenta",
    "Cynodon_dactylon",
    "Cynoglossum_creticum",
    "Cyperus_entrerianus",
    "Cyrtomium_falcatum",
    "Eichhornia_crassipes",
    "Firmiana_simplex",
    "Hedera_helix",
    "Hydrilla_verticillata",
    "Imperata_cylindrica",
    "Koelreuteria_paniculata",
    "Lantana_camara",
    "Leucaena_leucocephala",
    "Ligustrum_japonicum",
    "Ligustrum_lucidum",
    "Ligustrum_quihoui",
    "Ligustrum_sinense",
    "Ligustrum_vulgare",
    "Lonicera_japonica",
    "Lygodium_japonicum",
    "Macfadyena_unguis_cati",
    "Melia_azedarach",
    "Morus_alba",
    "Nandina_domestica",
    "Paspalum urvillei",
    "Paspalum_dilatatum",
    "Paspalum_notatum",
    "Pennisetum_ciliare",
    "Photinia_serratifolia",
    "Phyllostachys_aurea",
    "Pistacia_chinensis",
    "Pistia_stratiotes",
    "Poncirus_trifoliata",
    "Pueraria_montana",
    "Pyracantha_coccinea",
    "Pyrus_calleryana",
    "Rapistrum_rugosum",
    "Rosa_bracteata",
    "Salvinia_minima",
    "Salvinia_molesta",
    "Schinus_terebinthifolius",
    "Sesbania_punicea",
    "Silybum_marianum",
    "Solanum_pseudocapsicum",
    "Sorghum_halepense",
    "Tamarix_ramosissima",
    "Torilis_arvensis",
    "Triadica_sebifera",
    "Urochloa_maxima",
    "Verbena_brasiliensis",
    "Vitex_agnus-castus"
];



const other = [];

csvs.forEach(name => {
  if (!austin24.includes(name) && !other.includes(name)) {
    result.push(name);
  };
});

console.log(result);
