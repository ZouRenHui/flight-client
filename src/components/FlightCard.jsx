import React from "react";

const FlightCard = ({ flight, selectedOutboundFlightId, selectedReturnFlightId, onSelect }) => {
  console.log("flight.flightId:", flight.flightId);
  const isSelected = selectedOutboundFlightId === flight.flightId || selectedReturnFlightId === flight.flightId;

  const calculateDuration = (depTime, arrTime) => {
    const dep = new Date(`2000-01-01T${depTime}`);
    const arr = new Date(`2000-01-01T${arrTime}`);
    if (arr < dep) arr.setDate(arr.getDate() + 1);
    const diff = Math.abs(arr - dep);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const searchParamsStr = localStorage.getItem("flightSearchParams");
  const searchParams = searchParamsStr ? JSON.parse(searchParamsStr) : {};
  const labelType =
    flight.depCity === searchParams.depCity
      ? "Outbound"
      : flight.arrCity === searchParams.depCity
      ? "Return"
      : null;

  const renderLabel = () => {
    if (labelType === "Outbound") {
      return (
        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-full mr-2">
          Outbound
        </span>
      );
    }
    if (labelType === "Return") {
      return (
        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-full mr-2">
          Return
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 border-2 ${
        isSelected ? "border-blue-500" : "border-gray-200 hover:shadow-xl"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            {renderLabel()}
            <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600 font-bold text-sm">
              ✈️
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {flight.flightNumber}
              </h3>
              <p className="text-gray-600 text-sm">{flight.companyName}</p>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <div className="text-center mr-6">
              <div className="text-lg font-semibold">
                {flight.departureTime.substring(0, 5)}
              </div>
              <div className="text-sm text-gray-500">{flight.depName}</div>
              <div className="text-xs text-gray-400">{flight.depCode}</div>
            </div>

            <div className="flex flex-col items-center mx-2">
              <div className="text-gray-400 text-sm mb-1">
                {flight.stopCity ? "1 stop" : "Non-stop"}
              </div>
              <div className="w-20 h-0.5 bg-gray-300 relative">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  ⇆
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {flight.stopCity ? `Via ${flight.stopCity}` : "Direct"}
              </div>
            </div>

            <div className="text-center ml-6">
              <div className="text-lg font-semibold">
                {flight.arrivalTime.substring(0, 5)}
              </div>
              <div className="text-sm text-gray-500">{flight.arrName}</div>
              <div className="text-xs text-gray-400">{flight.arrCode}</div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 gap-4">
            <span>
              Flight duration:{" "}
              {calculateDuration(flight.departureTime, flight.arrivalTime)}
            </span>
            <span className="text-gray-400">•</span>
            <span>Plane type: {flight.planeType}</span>
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:ml-4">
          <div className="text-right mb-2">
            <div className="text-2xl font-bold text-blue-600">
              ¥{flight.priceClassY}
            </div>
            <div className="text-sm text-gray-500">Economy Class</div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 mt-4">
            <button
              disabled={isSelected}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isSelected
                  ? "bg-blue-700 text-white cursor-default"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={() => onSelect(flight.flightId)}
            >
              {isSelected ? "Selected" : "Select Flight"}
            </button>
          </div>
        </div>
      </div>

      {flight.stopCity && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Stopover at {flight.stopName} ({flight.stopCode})
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span>
              Layover:{" "}
              {flight.stopTime ? flight.stopTime.substring(0, 5) : "1h 15m"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
