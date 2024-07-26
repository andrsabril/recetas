export const data = {
    title: 'Brownie de chocolate',
    tags: ['Dulce', 'Postre', 'Desayuno', 'Merienda'],
    description: 'Lorem ipsum dolor sit amet consectetur amet consectetur. Lobortis arcu consequat.',
    preparingTime: 15,
    cookingTime: 10,
    perPerson: {
        default: 6,
        min: 4,
        max: 12,
        step: 2,
    },
    ingredients: [
        {
            name: 'Chocolate',
            quantity: 180,
            unit: 'g'
        },
        {
            name: 'Bicarbonato',
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
        }
    ]
}