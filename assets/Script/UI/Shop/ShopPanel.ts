import { _decorator, Animation, Component, instantiate, Node, Prefab } from "cc";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { ProductSlot } from "db://assets/Script/UI/Shop/ProductSlot";
import { EventName } from "db://assets/Script/Event/EventName";
import { ProductInfoUI } from "db://assets/Script/UI/Shop/ProductInfoUI";
import { ShopManager } from "db://assets/Script/Shop/ShopManager";
import { Shop } from "db://assets/Script/Shop/Shop";
import { ProductPurchasedEvent } from "db://assets/Script/Event/Events/ProductPurchasedEvent";
import { Product } from "db://assets/Script/Shop/Product";

const { ccclass, property } = _decorator;

/**
 * 商店面板
 */
@ccclass('ShopPanel')
export class ShopPanel extends Component {
    /**
     * 商品槽预制体
     */
    @property({ type: Prefab, displayName: '商品槽预制体' })
    productSlotPrefab: Prefab;

    /**
     * 动画机
     */
    private _anim: Animation;

    /**
     * 商品槽列表
     */
    private _slots: ProductSlot[] = [];

    /**
     * 商品列表
     */
    private _products: Product[] = [];

    /**
     * 商品信息
     */
    private _productInfo: ProductInfoUI;

    /**
     * 是否显示
     */
    private _show: boolean = false;

    /**
     * 商品栏节点
     */
    private _productBarNode: Node;

    /**
     * 当前商品
     */
    private _currentProduct: Product;

    /**
     * 当前商店
     */
    private _shop: Shop;

    onLoad() {
        this._productBarNode = this.node.getChildByName('ProductScrollView').getChildByName('ProductBar');
        this._anim = this.node.getComponent(Animation);
        this._productInfo = this.node.getChildByName('ProductInfo').getComponent(ProductInfoUI);

        EventCenter.on(EventName.UI_CLICK_PRODUCT_SLOT, this.node.name, (productSlot: ProductSlot) => this.handleClickProductSlot(productSlot));
        EventCenter.on(EventName.PRODUCT_PURCHASED, this.node.name, (event: ProductPurchasedEvent) => this.handleProductPurchased(event));
        // 不处理游戏关卡变更事件，只需要在show方法中进行处理。逻辑上面板打开时不会发生关卡变更事件
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 切换显示
     *
     * 按钮触发
     */
    toggle() {
        this._show = !this._show;
        this._anim.play(this._show ? 'Enter' : 'Exit');
        if (this._show) {
            this.populateProductBar();
        }
    }

    /**
     * 处理点击商品槽事件
     *
     * @param productSlot 商品槽
     */
    private handleClickProductSlot(productSlot: ProductSlot) {
        this._currentProduct = productSlot.product;
        this._productInfo.show(this._currentProduct);
    }

    /**
     * 填充商品栏
     */
    private populateProductBar() {
        const shop = ShopManager.shop();
        if (this._shop === shop) {
            // 商店不变则不处理
            return;
        }

        this._shop = shop;
        this._productBarNode.removeAllChildren();
        this._products = [];

        shop.productMetas.forEach(meta => {
            const node = instantiate(this.productSlotPrefab);
            this._productBarNode.addChild(node);
            const productSlot: ProductSlot = node.getComponent(ProductSlot);
            productSlot.init(ShopManager.product(meta));
            this._slots.push(productSlot);
            this._products.push(productSlot.product);
        });
        this._currentProduct = this._products[0];
        !!this._currentProduct ? this._productInfo.show(this._currentProduct) : this._productInfo.hide();
    }

    /**
     * 处理商品购买（后）事件
     *
     * @param event 事件参数
     */
    private handleProductPurchased(event: ProductPurchasedEvent) {
        this._slots.find(slot => slot.product.itemMeta.name === event.productName).updateCountLabel();
    }

    /**
     * 点击操作按钮
     *
     * 按钮触发
     */
    clickOperationButton() {
        ShopManager.buy(this._currentProduct);
    }
}