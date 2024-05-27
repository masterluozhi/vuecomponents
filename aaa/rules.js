let rulesObj = {
  null: { required: true, message: ' ' },
  null2: { required: true, message: ' ' },
  phone: { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  num: { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'change' },
  yes: {
    pattern: '[^ \x22]+', message: '不可输入空格', trigger: 'change'
  },
  pwd: {
    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/, message: '密码必须大于6位数，且包含字母和数字', trigger: 'blur'
  }
}

function rules(str, rules2 = []) {
  let arr2 = []
  if (str) {
    let arr = str.split(',')
    for (let a of arr) {
      arr2.push(rulesObj[a])
    }
  }
  return arr2.concat(rules2)
}

export default rules