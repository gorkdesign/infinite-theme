import ProductView from './product-view'

"use strict";

BurdaInfinite.views.products.ProductLookView = ProductView.extend({
  initialize: function (pOptions) {
    ProductView.prototype.initialize.call(this, pOptions);
  },
  delegateInview: function () {

  },
  createModel: function () {
    ProductView.prototype.createModel.call(this);

    this.model.set('componentType', 'look');
    this.model.set('variantType', 'look');
  },
  collectTrackingData: function (){
    ProductView.prototype.collectTrackingData.call(this);
      this.model.get('enhancedEcommerce').productExtraInformation =  this.$el.parent().data('product-variant');

  }
});

export default BurdaInfinite.views.products.ProductLookView;
