import Vue from 'vue'
import store from '@/store'
/**权限指令**/
const has = Vue.directive('has', {
    inserted: function (el, binding, vnode) {
        // 获取页面按钮权限
        let menuList = store.state.menuList;
        // console.log(menuList, 1)
        let btnPermissionsArr = filterRouteBtn(vnode.context.$route.path, menuList)
        console.log(btnPermissionsArr, 65555)
        // console.log(el.innerText, 66666)
        if (btnPermissionsArr && btnPermissionsArr.buttonNameList && !btnPermissionsArr.buttonNameList.includes(el.innerText)) {
            el.parentNode.removeChild(el)
        } else if (btnPermissionsArr && !btnPermissionsArr.buttonNameList) {
            el.parentNode.removeChild(el);
        }
    }
});

function filterRouteBtn(resPath, resMenuList) {
    let routeINfo;
    resMenuList.forEach(element => {
        if (element.subs && element.subs.length > 0) {
            let temp = filterSubMenuList(resPath, element.subs);
            if (temp) {
                routeINfo = temp
            }
        }
    });
    return routeINfo;
}

function filterSubMenuList(resPath, resSubsMenuList) {
    for (const element of resSubsMenuList) {
        if (`/${element.menuPath}` == resPath) {
            return element;
        } else if (element.subs && element.subs.length > 0) {
            return filterSubMenuList(resPath, element.subs)
        }
    }
}

export {
    has
}