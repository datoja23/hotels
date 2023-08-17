gitdocument.addEventListener('DOMContentLoaded', function () {
    // Inicializar Flatpickr
    flatpickr(".datepicker", {
        enableTime: false,
        dateFormat: "d/m/Y",
        // placeholder: "dd/mm/yyyy",
    });

    // Obtener elementos de filtros
    const sizeFilter = document.getElementById('size');
    const priceFilter = document.getElementById('price');
    const dateFromFilter = document.getElementById('start');
    const dateToFilter = document.getElementById('end');
    const countryFilter = document.getElementById('Countries');

    // Obtener botón "Clear"
    const clearButton = document.querySelector('button');
    clearButton.addEventListener('click', clearFilters);

    // Obtener elemento para el mensaje dinámico
    const dynamicMessageElement = document.getElementById('dynamicMessage');

    // Eventos de cambios en filtros
    sizeFilter.addEventListener('change', updateDynamicMessage);
    priceFilter.addEventListener('change', updateDynamicMessage);
    dateFromFilter.addEventListener('change', updateDynamicMessage);
    dateToFilter.addEventListener('change', updateDynamicMessage);
    countryFilter.addEventListener('change', updateDynamicMessage);

    // Actualizar mensaje dinámico inicialmente
    updateDynamicMessage();

    // Funciones para manejar filtros y mensaje dinámico
    function updateDynamicMessage() {
        const sizeValue = sizeFilter.value;
        const priceValue = priceFilter.value;
        const dateFromValue = dateFromFilter.value;
        const dateToValue = dateToFilter.value;
        const countryValue = countryFilter.value;
    
        let dynamicMessage = `${getSizeString(sizeValue)} hotels of ${getPriceString(priceValue)}`;

        // Agregar fechas solo si ambas han sido seleccionadas
        if (dateFromValue !== "dd/mm/aaaa" && dateToValue !== "dd/mm/aaaa") {
            dynamicMessage += `, ${getDateString(dateFromValue, dateToValue)}`;
        }
        
        dynamicMessage += ` in ${getCountryString(countryValue)}.`;

        dynamicMessageElement.innerHTML = dynamicMessage;
    }
    
    function getSizeString(sizeValue) {
        // Implementa tu lógica para convertir el valor de tamaño en un string legible
        // Ejemplo: "Small", "Medium", "Large"
        // return sizeValue; // Cambia esto
        switch (sizeValue) {
            case "All Size":
                return" All size";
            case "Small":
                return "Small-size";
            case "Medium":
                return "Medium-size";
            case "Large":
                return "Large-size";
            default:
               return"";
        }
    }

    function getPriceString(priceValue) {
        switch (priceValue) {
            case "All Price":
                return "all category prices";
            case "1":
                return "economic prices";
            case "2":
                return "comfort prices";
            case "3":
                return "premium prices";
            case "4":
                return "deluxe prices";
            default:
                // break;
                return "";
        }
    }    

    function getDateString(dateFromValue, dateToValue) {
        // Ejemplo: "from dd/mm/yyyy to dd/mm/yyyy"
        return `from ${dateFromValue} to ${dateToValue}`; // Cambia esto
    }

    function getCountryString(countryValue) {        
        // Ejemplo: "Argentina", "Brasil", etc.
        return countryValue; // Cambia esto
    }

    function clearFilters() {        
        sizeFilter.value = "All Size";
        priceFilter.value = "All Price";
        dateFromFilter.value = "dd/mm/aaaa";
        dateToFilter.value = "dd/mm/aaaa";
        countryFilter.value = "All Countries";
        updateDynamicMessage();
    }

    //   eventos
});
