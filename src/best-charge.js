function bestCharge(selectedItems) {
  let itemData = loadAllItems();
  let promoPlans = loadPromotions();
  let orderedItemData = getOrderedItemData(selectedItems, itemData);
  let priceOfPlus30Minus6 = plus30Minus6(orderedItemData);
  let priceOfHalfPricePromo = halfPriceOfParticularItem(orderedItemData, promoPlans[1].items);
  if (priceOfPlus30Minus6 < 30 && !hasHalfPriceItems(orderedItemData, promoPlans)) {
    return renderNoPromoText(orderedItemData, noPromoCharge(orderedItemData))
  } else if (priceOfPlus30Minus6 <= priceOfHalfPricePromo) {
    discount = noPromoCharge(orderedItemData) - priceOfPlus30Minus6;
    // TODO 在块级作用域中的let不能被外部访问
    // 那么我可以直接不用声明变量吗？
    // finalPrice = priceOfPlus30Minus6;
    // 这样后面的render才能拿到这个变量;
    // 还是说还需要用var来声明？
    var finalPrice = priceOfPlus30Minus6;
    var promoType = promoPlans[0].type;
    return renderOutput(orderedItemData, finalPrice, promoType, discount)
  } else {
    discount = noPromoCharge(orderedItemData) - priceOfHalfPricePromo;
    var finalPrice = priceOfHalfPricePromo;
    var promoType = promoPlans[1].type;
    return renderOutput(orderedItemData, finalPrice, promoType, discount)
  }
}

function hasHalfPriceItems(orderedItemData, promoPlans) {
  let halfPriceItemId = promoPlans[1].items;
  for (let i = 0; i < orderedItemData.length; i++) {
    if (halfPriceItemId.includes(orderedItemData[i].id)){
      return true;
    }
  }
  return false;
}

function renderNoPromoText(orderedItemData, totalPrice){
  let outputStr = "============= 订餐明细 =============\n"
  let detailStr = "";
  orderedItemData.forEach(item => {
    tmpStr = `${item.name} x ${item.count} = ${item.price * item.count}元\n`
    detailStr += tmpStr;
  })
  outputStr += detailStr;
  outputStr += 
    `-----------------------------------
总计：${totalPrice}元
===================================`
  return outputStr;
}

function renderOutput(orderedItemData, totalPrice, promoType, discount) {
  let outputStr = "============= 订餐明细 =============\n"
  let detailStr = "";
  if (promoType === "指定菜品半价") {
    promoType = "指定菜品半价(黄焖鸡，凉皮)";
  }
  orderedItemData.forEach(item => {
    tmpStr = `${item.name} x ${item.count} = ${item.price * item.count}元\n`
    detailStr += tmpStr;
  })
  outputStr += detailStr;
  outputStr +=
    `-----------------------------------
使用优惠:
${promoType}，省${discount}元
-----------------------------------
总计：${totalPrice}元
===================================
`
  return outputStr
}

function getOrderedItemData(input, itemData) {
  let items = [];
  input.forEach(element => {
    item = {};
    matched = element.match(/(\w*) x (\d)/)
    item.id = matched[1];
    item.count = matched[2];
    items.push(item);
  });
  items.forEach(ele => {
    for (let i = 0; i < itemData.length; i++) {
      if (itemData[i].id === ele.id) {
        ele.name = itemData[i].name;
        ele.price = itemData[i].price;
        break;
      }
    }
  })
  return items;
}

function noPromoCharge(orderedItemData) {
  let charge = 0;
  orderedItemData.forEach(item => {
    charge += item.price * item.count;
  })
  return charge;
}

function plus30Minus6(orderedItemData) {
  let chargeBeforePromo = noPromoCharge(orderedItemData);
  if (chargeBeforePromo > 30) {
    return chargeBeforePromo - 6;
  } else {
    return chargeBeforePromo;
  }
}

function halfPriceOfParticularItem(orderedItemData, halfPriceItemId) {
  let charge = 0;
  orderedItemData.forEach(item => {
    if (halfPriceItemId.includes(item.id)) {
      charge += item.price / 2 * item.count;
    } else {
      charge += item.price * item.count;
    }
  })
  return charge;
}