import React from 'react';

const BookingCard = ({ booking }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mr-3 flex items-center justify-center">
              <span>✈️</span>
            </div>
            <div>
              <h3 className="font-bold">{booking.flight.airline} - {booking.flight.flightNumber}</h3>
              <p className="text-gray-600 text-sm">{booking.flight.origin} to {booking.flight.destination}</p>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">{booking.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Passengers</p>
              <p className="text-sm font-medium">{booking.passengers}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Departure</p>
              <p className="text-sm font-medium">{booking.flight.departure}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className={`text-sm font-medium ${booking.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {booking.status}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-blue-600">${booking.flight.price * booking.passengers}</p>
          <p className="text-gray-600 text-sm">Total cost</p>
          <button className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;