(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductsView = BaseDynamicView.extend({
    apiURL: null,
    xhr: null,
    isInSlider: false,
    initialize: function(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);
      Mustache.tags = ['[[', ']]'];
      this.init();
    },
    init: function() {
      const parentModel = this.model.get('parentModel');
      this.isInSlider =
        !!parentModel && parentModel.get('type') == 'ecommerceSlider';

      this.apiURL = this.el[0].getAttribute('data-api-url') || null;
      !!this.apiURL && this.fetchProductsData();
    },
    fetchProductsData: function() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE)
          this.handleProductsData(xhr.responseText);
      }.bind(this);
      xhr.open('GET', this.apiURL, true);
      xhr.send(null);
    },
    handleProductsData: function(data) {
      var jsonData = JSON.parse(data);
      var templateContainer = this.el[0].querySelector('.template');
      var products;
      if (!!jsonData && !!templateContainer) {
        var template = templateContainer.innerHTML;
        var rendered = '';

        jsonData = this.prepareJsonData(jsonData);
        Mustache.parse(template);
        rendered = Mustache.render(template, { docs: jsonData.docs });
        templateContainer.innerHTML = rendered;
      }

      products = templateContainer.querySelectorAll('.item-ecommerce');
      Array.from(products).forEach(product => {
        var model = new Backbone.Model();
        var infModel = this.model.get('infiniteBlockDataModel');
        !!infModel && model.set('infiniteBlockDataModel', infModel);

        //TODO check implementation with ecommerce slider
        var productView = new ProductView({
          el: jQuery(product),
          model: model
        });
      });
      !!Drupal && Drupal.attachBehaviors(templateContainer);
      this.rendered();
    },
    rendered: function() {
      let sliderView;

      if (this.isInSlider) {
        sliderView = this.model.get('parentModel').get('view');
        //need to force a reInit.
        sliderView.reInit();
      }

      this.el[0].classList.add('rendered');
    },
    prepareJsonData: function(jsonData) {
      var data = Object.assign({}, jsonData);
      !!data.docs &&
        data.docs.forEach(element => {
          var elementData = element._source;
          if (elementData) {
            elementData.is_slider_product = this.isInSlider;
            elementData.image_style = elementData.image_style_product_300x324;
            if (
              this.el[0].classList.contains('item-paragraph--single-product')
            ) {
              elementData.image_style = elementData.image_style_product_600x648;
            }
          }
        });
      return data;
    }
  });

  window.ProductsView =
    window.ProductsView || BurdaInfinite.views.products.ProductsView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
