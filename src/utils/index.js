import _ from 'lodash'

// 千分位转化
const numToThousand = (num = 0) => {
    return _.chunk(_.reverse(_.split(_.toString(num), '')), 3).reverse()
    .map(item => item.reverse().join('')).join(',')

}

// 10020
// ['10020']
// ['02001']
// [['020'],['01']]
// [['01'],['020']]
// [['10'],['020']]
// ['10','020']
// '10,020'

export {numToThousand}