document.addEventListener("DOMContentLoaded", function () {

    // Capturar las fechas seleccionadas y mostrar en consola cuando ambas están seleccionadas
    let selectedStartDate = null;
    let selectedEndDate = null;
    // Obtener elementos de filtros
    const countryFilter = document.getElementById("Countries");
    const sizeFilter = document.getElementById("size");
    const priceFilter = document.getElementById("price");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    const fpStartDate = flatpickr(startDateInput, {
        dateFormat: "d/m/Y",
    });

    const fpEndDate = flatpickr(endDateInput, {
        dateFormat: "d/m/Y",
    });

    // Obtener elemento para el mensaje dinámico
    const dynamicMessageElement = document.getElementById("dynamicMessage");

    // Eventos de cambios en filtros
    countryFilter.addEventListener("change", updateDynamicMessage);
    sizeFilter.addEventListener("change", updateDynamicMessage);
    priceFilter.addEventListener("change", updateDynamicMessage);

    // Actualizar mensaje dinámico inicialmente
    updateDynamicMessage();

    // Funciones para manejar filtros y mensaje dinámico
    function updateDynamicMessage() {
        const sizeValue = sizeFilter.value;
        const priceValue = priceFilter.value;
        const countryValue = countryFilter.value;

        let dynamicMessage = `${getSizeString(
            sizeValue
        )} hotels of ${getPriceString(priceValue)}`;

        // Agregar fechas solo si ambas han sido seleccionadas
        if (selectedStartDate && selectedEndDate) {
            dynamicMessage += `, ${selectedStartDate.toLocaleDateString()} to ${selectedEndDate.toLocaleDateString()}`;
        }

        // Eliminar las fechas del mensaje si no están seleccionadas
        if (selectedStartDate == null || selectedEndDate == null) {
            dynamicMessage = dynamicMessage.replace(/,.*?to.*? /, ''); // Esto elimina la parte de la fecha del mensaje
        }

        dynamicMessage += ` in ${getCountryString(countryValue)}.`;

        dynamicMessageElement.innerHTML = dynamicMessage;
    }

    function getSizeString(sizeValue) {
        // Ejemplo: "Small", "Medium", "Large"
        // return sizeValue; 
        switch (sizeValue) {
            case "All Sizes":
                return " All size";
            case "Small":
                return "Small-size";
            case "Medium":
                return "Medium-size";
            case "Large":
                return "Large-size";
            default:
                return "";
        }
    }

    function getPriceString(priceValue) {
        switch (priceValue) {
            case "All Prices":
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
    function getCountryString(countryValue) {
        // Ejemplo: "Argentina", "Brasil", etc.
        return countryValue;
    }
    function getPriceSymbol(price) {
        // basado en el valor del precio
        return "$".repeat(price);
    }

    // Restablecer fechas al cargar la página
    fpStartDate.setDate(null);
    fpEndDate.setDate(null);
    startDateInput.value = "dd/mm/aaaa";
    endDateInput.value = "dd/mm/aaaa";


    const apiUrl = "https://6256097e8646add390e01d99.mockapi.io/hotels/reservation/hotels";

    // Función para crear una tarjeta de hotel
    function createHotelCard(hotel) {
        const hotelCard = document.createElement("div");
        hotelCard.classList.add("hotel-card");
        hotelCard.style.backgroundImage = `url(${hotel.photo})`;

        const hotelInfo = document.createElement("div");
        hotelInfo.classList.add("hotel-info");

        const hotelName = document.createElement("div");
        hotelName.classList.add("hotel-name");
        hotelName.textContent = hotel.name;

        const hotelCountry = document.createElement("div");
        hotelCountry.classList.add("hotel-Country");
        hotelCountry.textContent = `${hotel.country}`;

        const hotelDetails = document.createElement("div");
        hotelDetails.classList.add("hotel-Details");

        const detailsText = document.createElement("span");
        detailsText.textContent = `${hotel.rooms} rooms - ${getPriceSymbol(hotel.price)}`;

        const hotelDescription = document.createElement("div");
        hotelDescription.classList.add("hotel-description");
        hotelDescription.textContent = hotel.description;

        const bookButton = document.createElement("button");
        bookButton.classList.add("book-button");
        bookButton.textContent = "Book it!";

        // Agregar los elementos al div de hotelInfo
        hotelInfo.appendChild(hotelName);
        hotelInfo.appendChild(hotelCountry);
        hotelInfo.appendChild(hotelDetails);
        hotelDetails.appendChild(detailsText);
        hotelInfo.appendChild(hotelDescription);
        hotelDetails.appendChild(bookButton);

        // Agregar hotelInfo a hotelCard
        hotelCard.appendChild(hotelInfo);

        return hotelCard;
    }

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const container = document.querySelector(".container");

            let filteredData = data; // Mantener una copia original de los datos

            // Recorrer los datos y crear las tarjetas de hotel
            data.forEach((hotel) => {
                const hotelCard = createHotelCard(hotel);

                // Agregar hotelCard a container
                container.appendChild(hotelCard);
            });

            // Obtener elementos de filtros
            const sizeFilter = document.getElementById("size");
            const priceFilter = document.getElementById("price");
            const countryFilter = document.getElementById("Countries");

            // Agregar eventos "change" a los elementos de filtro
            sizeFilter.addEventListener("change", applyFilters);
            priceFilter.addEventListener("change", applyFilters);
            countryFilter.addEventListener("change", applyFilters);

            function applyFilters() {
                const sizeValue = sizeFilter.value;
                const priceValue = priceFilter.value;
                const countryValue = countryFilter.value;

                // Verificar si ambas fechas están seleccionadas
                if (selectedStartDate && selectedEndDate) {

                    // Filtrar los hoteles basados en las fechas seleccionadas
                    filteredData = data.filter((hotel) => {
                        // Convertir las fechas de disponibilidad de milisegundos a números enteros
                        const availabilityFrom = parseInt(hotel.availabilityFrom);
                        const availabilityTo = parseInt(hotel.availabilityTo);


                        // Calcular la diferencia en días entre las fechas de disponibilidad del hotel
                        const dateDifference = calculateDateDifference2(availabilityFrom, availabilityTo);
                        const dateDifference2 = calculateDateDifference(selectedStartDate.toLocaleDateString(), selectedEndDate.toLocaleDateString());

                        // Comparar la diferencia en días con algún valor deseado, por ejemplo, 5 días
                        return (
                            (dateDifference >= dateDifference2) && // Cambia 5 al valor deseado
                            (hotel.country === countryValue || countryValue === "All Countries") &&
                            (hotel.rooms === parseInt(sizeValue) || sizeValue === "All Sizes" || sizeInRange(hotel.rooms, sizeValue)) &&
                            (hotel.price === parseInt(priceValue) || priceValue === "All Prices")
                        );
                    });
                } else {
                    // Si las fechas no están seleccionadas, aplicar otros filtros sin las fechas
                    filteredData = data.filter((hotel) => {
                        return (
                            (hotel.country === countryValue || countryValue === "All Countries") &&
                            (hotel.rooms === parseInt(sizeValue) || sizeValue === "All Sizes" || sizeInRange(hotel.rooms, sizeValue)) &&
                            (hotel.price === parseInt(priceValue) || priceValue === "All Prices")
                        );
                    });
                }

                // Mostrar los hoteles filtrados
                displayFilteredHotels(filteredData);
            }
            // Función para limpiar filtros y aplicarlos nuevamente
            function clearAndApplyFilters() {
                clearFilters();
                applyFilters();
            }

            // Obtener botón "Clear"
            const clearButton = document.querySelector("button");
            clearButton.addEventListener("click", clearAndApplyFilters);

            // Función para limpiar filtros
            function clearFilters() {
                countryFilter.value = "All Countries";
                fpStartDate.setDate(null);
                fpEndDate.setDate(null);
                selectedStartDate = null;
                selectedEndDate = null;
                startDateInput.value = "dd/mm/aaaa";
                endDateInput.value = "dd/mm/aaaa";
                sizeFilter.value = "All Sizes";
                priceFilter.value = "All Prices";
                updateDynamicMessage();
            }

            function sizeInRange(rooms, selectedSize) {
                switch (selectedSize) {
                    case "Small":
                        return rooms >= 1 && rooms <= 10;
                    case "Medium":
                        return rooms >= 11 && rooms <= 20;
                    case "Large":
                        return rooms > 20;
                    default:
                        return false;
                }
            }


            fpStartDate.config.onClose.push(function (selectedDates) {
                selectedStartDate = selectedDates[0] || null;
                // Actualizar la fecha mínima de endDateInput
                fpEndDate.set("minDate", selectedStartDate);

                // Llamar a una función para mostrar los mensajes cuando ambas fechas están seleccionadas
                showSelectedDates();
                //  Llamar a la función para mostrar los mensajes cuando ambas fechas están seleccionadas
                applyFilters(); // Llamar a applyFilters cuando se selecciona una fecha
                updateDynamicMessage();
            });

            fpEndDate.config.onClose.push(function (selectedDates) {
                selectedEndDate = selectedDates[0] || null;

                // Llamar a una función para mostrar los mensajes cuando ambas fechas están seleccionadas
                showSelectedDates();
                //  Llamar a la función para mostrar los mensajes cuando ambas fechas están seleccionadas
                applyFilters(); // Llamar a applyFilters cuando se selecciona una fecha
                updateDynamicMessage();
            });

            function showSelectedDates() {
                if (selectedStartDate && selectedEndDate) {
                    // Calcular la diferencia en días
                    const daysDifference = calculateDateDifference(selectedStartDate.toLocaleDateString(), selectedEndDate.toLocaleDateString());
                    console.log(`La diferencia en días entre las fechas es: ${daysDifference} días`);
                }
            }

            function calculateDateDifference(startDate, endDate) {
                // Convertir las fechas en objetos Date
                const startDateParts = startDate.split("/");
                const endDateParts = endDate.split("/");
                const startDateObject = new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`);
                const endDateObject = new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`);

                // Calcular la diferencia en milisegundos
                const timeDifference = endDateObject - startDateObject;

                // Convertir la diferencia en días
                const daysDifference = timeDifference / (24 * 60 * 60 * 1000);

                // Redondear a números enteros
                return Math.round(daysDifference);
            }
            function calculateDateDifference2(startDate, endDate) {
                // Calcula la diferencia en milisegundos entre las dos fechas
                const timeDifference = endDate - startDate;

                // Convierte la diferencia en días y redondea
                return Math.round(timeDifference / (24 * 60 * 60 * 1000));
            }

            function displayFilteredHotels(filteredData) {

                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                // Mostrar los hoteles filtrados en el contenedor
                filteredData.forEach((hotel) => {
                    const hotelCard = createHotelCard(hotel);

                    // Agregar hotelCard a container
                    container.appendChild(hotelCard);
                });


            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});