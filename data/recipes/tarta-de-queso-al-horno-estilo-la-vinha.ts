export const data = {
    id: 1,
    title: 'Tarta de queso al horno estilo la viña',
    tags: ['Dulce', 'Postre', 'Merienda', 'Tarta'],
    description: 'Lorem ipsum dolor sit amet consectetur amet consectetur. Lobortis arcu consequat.',
    preparingTime: 15,
    cookingTime: 60,
    perPerson: {
        default: 6,
        min: 4,
        max: 12,
        step: 2,
    },
    ingredients: [
        {
            name: 'Queso',
            quantity: 180,
            unit: 'g'
        },
        {
            name: 'Nata',
            quantity: 1,
            unit: 'Cucharada'
        },
        {
            name: 'Azúcar',
            quantity: 180,
            unit: 'g'
        },
        {
            name: 'Harina',
            quantity: 180,
            unit: 'g'
        },
        {
            name: 'Huevos',
            quantity: 2,
            unit: 'u'
        },
        {
            name: 'Tomate',
            quantity: 1,
            unit: 'Cucharada',
            hasReference: 'Brownie de chocolate',
        },
        {
            name: 'Pollo',
            quantity: 180,
            unit: 'g'
        },
        {
            name: 'Cebolla',
            quantity: 180,
            unit: 'g'
        },
        {
            name: 'Salsa de soja',
            quantity: 2,
            unit: 'u',
            hasReference: 'Brownie de chocolate',
        }
    ],
    preparation: [
        {
            title: 'Mezclar los huevos con el azucar',
            description: [
                { sentence: 'Batir en un bol las yemas con el azucar.' },
                { image: 'batir-huevos' }
            ]
        },
        {
            title: 'Mezclar los huevos con el azucar',
            description: [
                { sentence: 'Batir en un bol las yemas con el azucar.' },
                { image: 'batir-huevos' },
                { carousel: [
                    { image: 'batir-huevos' },
                    { image: 'batir-huevos' },
                    { image: 'batir-huevos' },
                ] },
            ]
        },
    ]
}