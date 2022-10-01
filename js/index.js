// Список компонент (from components.js)
const components = {
  header: Header,
  navbar: NavBar,
  content: Content,
  footer: Footer,
};

// Список поддердживаемых роутов (from pages.js)
const routes = {
  main: HomePage,
  about: About,
  contacts: Contacts,
  category: Category,
  default: HomePage,
  error: ErrorPage,
};

/* ----- spa init module --- */
const mySPA = (function() {

  /* ------- begin view -------- */
  function ModuleView() {
    let myModuleContainer = null;
    let menu = null;
    let contentContainer = null;
    let routesObj = null;

    this.init = function(container, routes) {
      myModuleContainer = container;
      routesObj = routes;
      menu = myModuleContainer.querySelector("#mainmenu");
      contentContainer = myModuleContainer.querySelector("#content");
    }

    this.renderContent = function(hashPageName) {
      let routeName = "default";

      if (hashPageName.length > 0) {
        routeName = hashPageName in routes ? hashPageName : "error";
      }

      window.document.title = routesObj[routeName].title;
      contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`);
      if (routeName === "about") this.showCanvas();
      if (routeName === "contacts") this.showCanvas2();
      this.updateButtons(routesObj[routeName].id);
    }

    this.showCanvas = function() {
      const canvas = document.createElement("canvas");

      canvas.id = "my-canvas";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.zIndex = 0;
      canvas.style.position = "absolute";

      contentContainer.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.fillRect(100, 100, 200, 200);
      ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
      ctx.fillRect(150, 150, 200, 200);
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fillRect(200, 50, 200, 200);

      cursorLayer = document.getElementById("my-canvas");
      console.log(cursorLayer);
    }

    this.showCanvas2 = function() {
      const canvas = document.getElementById("test");
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.fillRect(100, 100, 200, 200);
      ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
      ctx.fillRect(150, 150, 200, 200);
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fillRect(200, 50, 200, 200);
    }

     this.updateButtons = function(currentPage) {
      const menuLinks = menu.querySelectorAll(".mainmenu__link");

      for (let link of menuLinks) {
        currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
      }
    }
  };
  /* -------- end view --------- */
  /* ------- begin model ------- */
  function ModuleModel () {
      let myModuleView = null;

      this.init = function(view) {
        myModuleView = view;
      }

      this.updateState = function(pageName) {
        myModuleView.renderContent(pageName);
      }
  }

  /* -------- end model -------- */
  /* ----- begin controller ---- */
  function ModuleController () {
      let myModuleContainer = null;
      let myModuleModel = null;

      this.init = function(container, model) {
        myModuleContainer = container;
        myModuleModel = model;

        // вешаем слушателей на событие hashchange и кликам по пунктам меню
        window.addEventListener("hashchange", this.updateState);

        this.updateState(); //первая отрисовка
      }

      this.updateState = function() {
        const hashPageName = location.hash.slice(1).toLowerCase();
        myModuleModel.updateState(hashPageName);
      }
  };
  /* ------ end controller ----- */

  return {
      init: function({ container, routes, components }) {
        this.renderComponents(container, components);

        const view = new ModuleView();
        const model = new ModuleModel();
        const controller = new ModuleController();

        //связываем части модуля
        view.init(document.getElementById(container), routes);
        model.init(view);
        controller.init(document.getElementById(container), model);
      },

      renderComponents: function (container, components) {
        const root = document.getElementById(container);
        const componentsList = Object.keys(components);
        for (let item of componentsList) {
          root.innerHTML += components[item].render("component");
        }
      },
  };

}());
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init({
  container: "app",
  routes: routes,
  components: components
}));
