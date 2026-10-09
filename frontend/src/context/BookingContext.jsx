import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState(() => {
    return localStorage.getItem('eventora_selected_event') || 'Wedding';
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem('eventora_selected_date') || new Date().toISOString().split('T')[0];
  });

  const [slotData, setSlotData] = useState(null);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(() => {
    try {
      const saved = localStorage.getItem('eventora_selected_package');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [selectedServices, setSelectedServices] = useState(() => {
    try {
      const saved = localStorage.getItem('eventora_selected_services');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedPreOrders, setSelectedPreOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('eventora_selected_preorders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [guestCount, setGuestCount] = useState(() => {
    try {
      const saved = localStorage.getItem('eventora_guest_count');
      return saved ? Number(saved) : 150;
    } catch (e) {
      return 150;
    }
  });

  // Sync to local storage
  useEffect(() => {
    if (selectedEvent) localStorage.setItem('eventora_selected_event', selectedEvent);
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedDate) localStorage.setItem('eventora_selected_date', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (selectedPackage) {
      localStorage.setItem('eventora_selected_package', JSON.stringify(selectedPackage));
    } else {
      localStorage.removeItem('eventora_selected_package');
    }
  }, [selectedPackage]);

  useEffect(() => {
    localStorage.setItem('eventora_selected_services', JSON.stringify(selectedServices));
  }, [selectedServices]);

  useEffect(() => {
    localStorage.setItem('eventora_selected_preorders', JSON.stringify(selectedPreOrders));
  }, [selectedPreOrders]);

  useEffect(() => {
    localStorage.setItem('eventora_guest_count', guestCount.toString());
  }, [guestCount]);

  // Check slot availability whenever event or date changes
  const checkSlot = useCallback(async (eventType, date) => {
    const targetEvent = eventType || selectedEvent;
    const targetDate = date || selectedDate;
    if (!targetEvent || !targetDate) return;

    setSlotLoading(true);
    setSlotError(null);
    try {
      const res = await api.checkSlotAvailability(targetEvent, targetDate);
      if (res.success) {
        setSlotData(res.data);
      }
    } catch (err) {
      console.error('Failed to check slot:', err);
      setSlotError(err.message || 'Unable to verify slot availability');
    } finally {
      setSlotLoading(false);
    }
  }, [selectedEvent, selectedDate]);

  // Initial and reactive slot check
  useEffect(() => {
    if (selectedEvent && selectedDate) {
      checkSlot(selectedEvent, selectedDate);
    }
  }, [selectedEvent, selectedDate, checkSlot]);

  // Handle Event selection
  const setEvent = (event) => {
    const eventName = typeof event === 'string' ? event : event?.name;
    setSelectedEvent(eventName);
  };

  // Handle Date selection
  const setDate = (date) => {
    setSelectedDate(date);
  };

  // Select package
  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  // Add / remove service
  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s._id === service._id || s.serviceId === service._id);
      if (exists) {
        return prev.filter(s => s._id !== service._id && s.serviceId !== service._id);
      } else {
        const isPerGuest = service.pricingUnit === 'per_guest';
        const total = isPerGuest ? service.price * guestCount : service.price;
        return [...prev, {
          ...service,
          serviceId: service._id,
          quantity: isPerGuest ? guestCount : 1,
          total
        }];
      }
    });
  };

  // Check if service is selected
  const isServiceSelected = (serviceId) => {
    return selectedServices.some(s => s._id === serviceId || s.serviceId === serviceId);
  };

  // Pre-orders management
  const addPreOrder = (item, quantity = 1) => {
    if (quantity <= 0) {
      removePreOrder(item._id);
      return;
    }
    setSelectedPreOrders(prev => {
      const index = prev.findIndex(p => p._id === item._id || p.preOrderId === item._id);
      const total = item.price * quantity;
      if (index > -1) {
        const updated = [...prev];
        updated[index] = {
          ...item,
          preOrderId: item._id,
          quantity,
          total
        };
        return updated;
      } else {
        return [...prev, {
          ...item,
          preOrderId: item._id,
          quantity,
          total
        }];
      }
    });
  };

  const updatePreOrderQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removePreOrder(itemId);
      return;
    }
    setSelectedPreOrders(prev =>
      prev.map(p => {
        if (p._id === itemId || p.preOrderId === itemId) {
          return {
            ...p,
            quantity,
            total: p.price * quantity
          };
        }
        return p;
      })
    );
  };

  const removePreOrder = (itemId) => {
    setSelectedPreOrders(prev => prev.filter(p => p._id !== itemId && p.preOrderId !== itemId));
  };

  const getPreOrderQuantity = (itemId) => {
    const item = selectedPreOrders.find(p => p._id === itemId || p.preOrderId === itemId);
    return item ? item.quantity : 0;
  };

  // Update guest count and recompute per_guest service totals
  const updateGuestCount = (count) => {
    const validCount = Math.max(10, Number(count) || 10);
    setGuestCount(validCount);
    setSelectedServices(prev =>
      prev.map(s => {
        if (s.pricingUnit === 'per_guest') {
          return {
            ...s,
            quantity: validCount,
            total: s.price * validCount
          };
        }
        return s;
      })
    );
  };

  // Calculations
  const calculations = useMemo(() => {
    const packageCost = selectedPackage ? Number(selectedPackage.price) : 0;
    
    const servicesCost = selectedServices.reduce((sum, s) => {
      const isPerGuest = s.pricingUnit === 'per_guest';
      const itemTotal = isPerGuest ? s.price * guestCount : s.price;
      return sum + itemTotal;
    }, 0);

    const preOrdersCost = selectedPreOrders.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    const subtotal = packageCost + servicesCost + preOrdersCost;

    // Loyalty / Seasonal discount: 5% discount if subtotal >= 100,000
    const discount = subtotal >= 100000 ? Math.round(subtotal * 0.05) : 0;

    // Standard 5% GST & service tax on net
    const taxableAmount = subtotal - discount;
    const taxes = Math.round(taxableAmount * 0.05);

    const grandTotal = taxableAmount + taxes;

    return {
      packageCost,
      servicesCost,
      preOrdersCost,
      subtotal,
      discount,
      taxes,
      grandTotal
    };
  }, [selectedPackage, selectedServices, selectedPreOrders, guestCount]);

  // Reset booking state
  const resetBookingFlow = () => {
    setSelectedPackage(null);
    setSelectedServices([]);
    setSelectedPreOrders([]);
    setGuestCount(100);
    try {
      localStorage.removeItem('eventora_selected_package');
      localStorage.removeItem('eventora_selected_services');
      localStorage.removeItem('eventora_selected_preorders');
      localStorage.removeItem('eventora_guest_count');
    } catch (e) {
      console.warn('Failed to clear local storage:', e);
    }
  };

  // Submit complete booking
  const confirmBooking = async (customerDetails, specialRequests = '') => {
    if (!slotData?.isAvailable) {
      throw new Error('Sorry, this date is fully booked. Please select another available date.');
    }

    if (!selectedPackage) {
      throw new Error('Please select an event package before confirming.');
    }

    const bookingPayload = {
      eventType: selectedEvent,
      eventDate: selectedDate,
      package: selectedPackage,
      services: selectedServices,
      preOrders: selectedPreOrders,
      guestCount,
      subtotal: calculations.subtotal,
      discount: calculations.discount,
      taxes: calculations.taxes,
      totalAmount: calculations.grandTotal,
      customer: customerDetails,
      specialRequests
    };

    const res = await api.createBooking(bookingPayload);
    // Refresh slot data after booking and clear cart details
    if (res.success) {
      resetBookingFlow();
      await checkSlot(selectedEvent, selectedDate);
    }
    return res;
  };

  return (
    <BookingContext.Provider
      value={{
        selectedEvent,
        setEvent,
        selectedDate,
        setDate,
        slotData,
        slotLoading,
        slotError,
        checkSlot,

        selectedPackage,
        selectPackage,

        selectedServices,
        toggleService,
        isServiceSelected,

        selectedPreOrders,
        addPreOrder,
        updatePreOrderQuantity,
        removePreOrder,
        getPreOrderQuantity,

        guestCount,
        updateGuestCount,

        calculations,
        resetBookingFlow,
        clearBooking: resetBookingFlow,
        clearCart: resetBookingFlow,
        confirmBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
