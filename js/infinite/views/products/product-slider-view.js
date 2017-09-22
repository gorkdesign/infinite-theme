(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.ProductSliderView = ProductView.extend({
    ecommerceSliderModel: new Backbone.Model(),
    $ecommerceSlider: [],
    initialize: function (pOptions) {
      if (this.model.has('parentModel') && this.model.get('parentModel').get('type') == 'ecommerceSlider') {
        this.ecommerceSliderModel = this.model.get('parentModel');
        this.$ecommerceSlider = this.ecommerceSliderModel.get('el');
      }

      ProductView.prototype.initialize.call(this, pOptions);
    },
    delegateInview: function () {
      //override inview method
    },
    setProductIndex: function () {
      if (this.$ecommerceSlider.length > 0) {
        var tmpProductIndex = this.$ecommerceSlider.find('.item-ecommerce').not('.swiper-slide-duplicate').index(this.$el);
        this.model.set('productIndex', tmpProductIndex);
      }
    }
  });

  window.ProductSliderView = window.ProductSliderView || BurdaInfinite.views.ProductSliderView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);