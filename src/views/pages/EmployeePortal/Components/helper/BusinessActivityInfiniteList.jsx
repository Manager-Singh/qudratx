import React, { useEffect, useState, useRef, useCallback } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { getBusinessActivityByAuthorityId } from '../../../../../store/admin/businessActivitySlice';
import CardSelector from '../CardSelector/CardSelector';
import { ToastExample } from '../../../../../components/toast/Toast';

const PAGE_SIZE = 20;

const BusinessActivityStepSelector = ({ step, authority_id, max_activity_selected, selectedActivities, setSelectedActivities }) => {
  const dispatch = useDispatch();
  
  // --- STATE ---
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
  const [searchInput, setSearchInput] = useState('');
  const [businessActivities, setBusinessActivities] = useState([]); // For the card grid display
  const [activityOptions, setActivityOptions] = useState([]); // For the react-select dropdown
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  // --- REFS ---
  const loader = useRef(null);
  const observer = useRef(null);
  const loadingRef = useRef(false); // Prevents multiple simultaneous fetches

  // --- CALLBACKS & HANDLERS ---

  // Memoized toast handler
  const showToast = useCallback((status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  }, []);

  // ✅ **FIXED**: Core data fetching logic
  const fetchActivities = useCallback(async (pageNum, search = '') => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await dispatch(
        getBusinessActivityByAuthorityId({
          authority_id,
          page: pageNum,
          limit: PAGE_SIZE,
          search,
        })
      );

      if (res.error) {
        throw new Error(res.error.message || 'Failed to load');
      }

      const data = res.payload?.data || [];

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
      
      // Update the grid content: replace on new search (page 1), append on scroll
      setBusinessActivities((prev) => {
        const newItems = data.filter((item) => !prev.some((existing) => existing.id === item.id));
        return pageNum === 1 ? newItems : [...prev, ...newItems];
      });

      const newOptions = data.map((item) => ({
        value: item.id,
        label: `(${item.activity_code}) ${item.activity_name}`,
        code: item.activity_code,
        data: item, // Crucial: Embed the full object
      }));

      // ✅ **FIXED**: Robustly update the dropdown options
      setActivityOptions((prevOptions) => {
        const currentOptions = pageNum === 1 ? [] : prevOptions;
        const optionsMap = new Map(currentOptions.map(o => [o.value, o]));

        newOptions.forEach(option => optionsMap.set(option.value, option));

        // Always ensure selected items are in the options list
        selectedActivities.forEach(item => {
          if (!optionsMap.has(item.id)) {
            optionsMap.set(item.id, {
              value: item.id,
              label: `(${item.activity_code}) ${item.activity_name}`,
              code: item.activity_code,
              data: item,
            });
          }
        });

        return Array.from(optionsMap.values());
      });

    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again.');
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setInitialLoad(false);
    }
  }, [dispatch, authority_id, selectedActivities, showToast]); // ✅ **FIXED**: Added `selectedActivities` dependency

  // ✅ **FIXED**: Selection handler for the dropdown
  const handleActivityChange = (selectedOptions) => {
    // Directly map from the `data` property in each option
    const selectedItems = selectedOptions ? selectedOptions.map(opt => opt.data) : [];
    
    if (selectedItems.length <= max_activity_selected) {
      setSelectedActivities(selectedItems);
    } else {
      showToast('warning', `You can select up to ${max_activity_selected} activities only`);
    }
  };

  // Memoized selection handler for the grid cards
  const handleActivityToggle = useCallback((activity) => {
    setSelectedActivities((prev) => {
      if (prev.some(item => item.id === activity.id)) {
        return prev.filter((item) => item.id !== activity.id); // Unselect
      } else if (prev.length < max_activity_selected) {
        return [...prev, activity]; // Select if under limit
      } else {
        showToast('warning', `You can select up to ${max_activity_selected} activities only`);
        return prev; // Ignore click if limit reached
      }
    });
  }, [max_activity_selected, setSelectedActivities, showToast]);

  const removeSelectedActivity = (id) => {
    setSelectedActivities((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMenuScrollToBottom = () => {
    if (hasMore && !loadingRef.current) {
      setPage(prev => prev + 1);
    }
  };

  // --- EFFECTS ---

  // Effect to reset and fetch data when the step or authority changes
  useEffect(() => {
    if (step === 3 && authority_id) {
      setBusinessActivities([]);
      setActivityOptions([]);
      setPage(1);
      setHasMore(true);
      setInitialLoad(true);
      setSearchInput('');
      loadingRef.current = false;
      if(observer.current) observer.current.disconnect();
      
      // Pass the initial empty `selectedActivities` to `fetchActivities` on first load
      fetchActivities(1, '', []);
    }
  }, [authority_id, step]);


  // Effect for pagination (both grid and dropdown)
  useEffect(() => {
    // We only fetch on page changes after the initial load, which is handled by the effect above.
    if (step === 3 && page > 1) {
      fetchActivities(page, searchInput);
    }
  }, [page, step]);


  // Intersection Observer for infinite scroll in the grid
  useEffect(() => {
    if (!hasMore || loading || step !== 3) return;

    const callback = (entries) => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        setPage(prev => prev + 1);
      }
    };

    observer.current = new IntersectionObserver(callback, { root: null, rootMargin: '100px', threshold: 0.1 });
    
    const currentLoader = loader.current;
    if (currentLoader) {
      observer.current.observe(currentLoader);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, step, loading]);


  if (step !== 3) return null;

  return (
    <div className="d-flex flex-column" style={{ height: '60vh' }}>
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div>
        <h4>Select Business Activities</h4>
        <Select
          isMulti
          options={activityOptions}
          value={activityOptions.filter((opt) => selectedActivities.some(item => item.id === opt.value))}
          onChange={handleActivityChange}
          placeholder="Search by name or code..."
          className="mb-3"
          components={{ MultiValue: () => null }} 
            backspaceRemovesValue={false}
             isClearable={false}
          inputValue={searchInput}
          onInputChange={(value, { action }) => {
            // Only trigger search on user input, not on selection/blur
            if (action === 'input-change') {
              setSearchInput(value);
              setPage(1);
              setHasMore(true);
              fetchActivities(1, value); // ✅ **FIXED**: Let fetchActivities handle data replacement
            }
          }}
          onMenuScrollToBottom={handleMenuScrollToBottom}
          isLoading={loading && page === 1} // Show loader only for initial/search fetches
          loadingMessage={() => 'Loading...'}
          noOptionsMessage={() => (initialLoad || (loading && page === 1)) ? 'Loading...' : 'No results found'}
        />

        {/* Selected badges */}
        <div className="mb-3 d-flex flex-wrap gap-2" style={{ minHeight: '40px' }}>
          {selectedActivities.map((activity) => (
            <span
              key={activity.id}
              className="badge bg-primary d-flex align-items-center"
              style={{ padding: '0.5rem 0.75rem', borderRadius: '20px' }}
            >
              {`(${activity.activity_code}) ${activity.activity_name}`}
              <FaTimes
                onClick={() => removeSelectedActivity(activity.id)}
                style={{ marginLeft: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable activity grid area */}
      <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
        {initialLoad ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : businessActivities.length === 0 && !loading ? (
          <div className="text-center text-muted py-5">No activities found</div>
        ) : (
          <>
            <div className="row">
              {businessActivities.map((item) => (
                <div key={item.id} className="col-3 p-2">
                  <CardSelector
                    type="checkbox"
                    title={item.activity_name}
                    activity_code={item.activity_code}
                    selected={selectedActivities.some(activity => activity.id === item.id)}
                    onClick={() => handleActivityToggle(item)}
                    name="activity_group"
                  />
                </div>
              ))}
            </div>

            <div ref={loader} style={{ height: '20px' }} />
            {loading && page > 1 && ( // Show loader only for pagination fetches
              <div className="d-flex justify-content-center my-3">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            )}
            {!hasMore && businessActivities.length > 0 && (
              <div className="text-center text-muted py-3">All activities loaded</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessActivityStepSelector;











// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import Select from 'react-select';
// import { useDispatch } from 'react-redux';
// import { FaTimes } from 'react-icons/fa';
// import { getBusinessActivityByAuthorityId } from '../../../../../store/admin/businessActivitySlice';
// import CardSelector from '../CardSelector/CardSelector';
// import { ToastExample } from '../../../../../components/toast/Toast'

// const PAGE_SIZE = 20;

// const BusinessActivityStepSelector = ({ step, authority_id, max_activity_selected, selectedActivities, setSelectedActivities }) => {
//   const dispatch = useDispatch();
//   // toast states
//   const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
//   const showToast = (status, message) => {
//     setToastData({ show: true, status, message })
//     setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
//   }
//    const [searchInput, setSearchInput] = useState('');
//   const [businessActivities, setBusinessActivities] = useState([]);
//   const [activityOptions, setActivityOptions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const [error, setError] = useState(null);

//   const loader = useRef(null);
//   const observer = useRef(null);
//   const loadingRef = useRef(false);

//   // Memoized fetch function
// //  const fetchActivities = useCallback(async (pageNum) => {
// //   if (loadingRef.current) return;
// //   loadingRef.current = true;
// //   setLoading(true);
// //   setError(null);

// //   try {
// //     const res = await dispatch(
// //       getBusinessActivityByAuthorityId({
// //         authority_id,
// //         page: pageNum,
// //         limit: PAGE_SIZE, // ✅ Rename from PAGE_SIZE to limit
// //       })
// //     );

// //       if (res.error) {
// //         if (businessActivities.length > 0) {
// //           setHasMore(false);
// //           return;
// //         }
// //         throw new Error(res.error.message || 'Failed to load');
// //       }

// //       const data = res.payload?.data || [];

// //       if (data.length < PAGE_SIZE) {
// //         setHasMore(false);
// //       }
      

// //       setBusinessActivities((prev) => {
// //         const newItems = data.filter((item) => !prev.some((existing) => existing.id === item.id));
// //         return [...prev, ...newItems];
// //       });

// //       const newOptions = data.map((item) => ({
// //         value: item.id,
// //         label: `(${item.activity_code}) ${item.activity_name}`,
// //         code: item.activity_code,
// //         data: item // Store the full object here
// //       }));

// //       setActivityOptions((prev) => {
// //         const combined = [...prev, ...newOptions];
// //         return Array.from(new Map(combined.map((o) => [o.value, o])).values());
// //       });
// //     } catch (err) {
// //       console.error('Error fetching activities:', err);
// //       setError('Failed to load activities. Please try again.');
// //       setHasMore(false);
// //     } finally {
// //       loadingRef.current = false;
// //       setLoading(false);
// //       setInitialLoad(false);
// //     }
// //   }, [dispatch, authority_id, businessActivities.length]);
// const fetchActivities = useCallback(
//   async (pageNum, search = '', replaceOptions = false) => {
//     if (loadingRef.current) return;
//     loadingRef.current = true;
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await dispatch(
//         getBusinessActivityByAuthorityId({
//           authority_id,
//           page: pageNum,
//           limit: PAGE_SIZE,
//           search,
//         })
//       );

//       if (res.error) {
//         if (businessActivities.length > 0) {
//           setHasMore(false);
//           return;
//         }
//         throw new Error(res.error.message || 'Failed to load');
//       }

//       const data = res.payload?.data || [];

//       if (data.length < PAGE_SIZE) {
//         setHasMore(false);
//       }

//       // Always accumulate businessActivities (for card grid)
//       setBusinessActivities((prev) => {
//         const newItems = data.filter((item) => !prev.some((existing) => existing.id === item.id));
//         return pageNum === 1 ? newItems : [...prev, ...newItems];
//       });

//       const newOptions = data.map((item) => ({
//         value: item.id,
//         label: `(${item.activity_code}) ${item.activity_name}`,
//         code: item.activity_code,
//         data: item,
//       }));

// setActivityOptions((prev) => {
//   const selectedOptions = selectedActivities.map((item) => ({
//     value: item.id,
//     label: `(${item.activity_code}) ${item.activity_name}`,
//     code: item.activity_code,
//     data: item
//   }));

//   const combined = [...selectedOptions, ...newOptions];
//   return Array.from(new Map(combined.map((o) => [o.value, o])).values());
// });

// //       setActivityOptions((prev) => {
// //   if (replaceOptions) {
// //     const selectedOptions = selectedActivities.map((item) => ({
// //       value: item.id,
// //       label: `(${item.activity_code}) ${item.activity_name}`,
// //       code: item.activity_code,
// //       data: item
// //     }));

// //     const combined = [...selectedOptions, ...newOptions];
// //     return Array.from(new Map(combined.map((o) => [o.value, o])).values());
// //   }
  
// //   const combined = [...prev, ...newOptions];
// //   return Array.from(new Map(combined.map((o) => [o.value, o])).values());
// // });

//     } catch (err) {
//       console.error('Error fetching activities:', err);
//       setError('Failed to load activities. Please try again.');
//       setHasMore(false);
//     } finally {
//       loadingRef.current = false;
//       setLoading(false);
//       setInitialLoad(false);
//     }
//   },
//   [dispatch, authority_id]
// );


//   useEffect(() => {
//   if (step === 3) {
//     setBusinessActivities([]);
//     setActivityOptions([]);
//     setPage(1);
//     setHasMore(true);
//     setInitialLoad(true);
//     loadingRef.current = false;

//     // Immediately fetch page 1
//     fetchActivities(1);
//   }
// }, [authority_id, step]);

//   // Initial load and page change effect
//   useEffect(() => {
//     if (step === 3 && (initialLoad || page > 1)) {
//       fetchActivities(page);
//     }
//   }, [page, step, initialLoad, fetchActivities]);

//   // Intersection Observer for infinite scroll
//   useEffect(() => {
//     if (!hasMore || step !== 3) return;

//     const options = {
//       root: null,
//       rootMargin: '100px',
//       threshold: 0.1
//     };

//     const callback = (entries) => {
//       if (entries[0].isIntersecting && !loadingRef.current) {
//         setPage(prev => prev + 1);
//       }
//     };

//     observer.current = new IntersectionObserver(callback, options);
    
//     const currentLoader = loader.current;
//     if (currentLoader) {
//       observer.current.observe(currentLoader);
//     }

//     return () => {
//       if (observer.current) {
//         observer.current.disconnect();
//       }
//     };
//   }, [hasMore, step, loadingRef.current]);

//   const handleActivityToggle = (activity) => {
//     setSelectedActivities((prev) => {
//       if (prev.some(item => item.id === activity.id)) {
//         return prev.filter((item) => item.id !== activity.id); // unselect
//       } else if (prev.length < max_activity_selected) {
//         return [...prev, activity]; // select if under limit
//       } else {
//         showToast('warning', `You can select up to ${max_activity_selected} activities only`);
//         return prev; // ignore click if limit reached
//       }
//     });
//   };
//    const handleMenuScrollToBottom = () => {
//      if (hasMore && !loadingRef.current) {
//       setPage(prev => prev + 1);
//    }
//   };
  

//    const handleActivityChange = (selectedOptions) => {
//      const selectedItems = selectedOptions
//        .map((opt) => businessActivities.find((act) => act.id === opt.value))
//        .filter(Boolean);
//      if (selectedItems.length <= max_activity_selected) {
//        setSelectedActivities(selectedItems);
//      } else {
//        showToast('warning', `You can select up to ${max_activity_selected} activities only`);
//      }
//    }
   
//    if (step !== 3) return null;
// const removeSelectedActivity = (id) => {
//      setSelectedActivities((prev) => prev.filter((item) => item.id !== id));
//    }

//   return (
//     <div className="d-flex flex-column" style={{ height: '60vh' }}>
//       {toastData.show && (
//         <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
//           <ToastExample status={toastData.status} message={toastData.message} />
//         </div>
//       )}
//       {/* Header + select */}
//       <div>
//         <h4>Select Business Activities</h4>
//          <Select
//           isMulti
//           options={activityOptions}
//           value={activityOptions.filter((opt) => selectedActivities.some(item => item.id === opt.value))}
//           onChange={handleActivityChange}
//           placeholder="Search by name or code..."
//           className="mb-3"
//           components={{ MultiValue: () => null }}
//           inputValue={searchInput}
//         onInputChange={(value) => {
//   setSearchInput(value);
//   setPage(1);
//   setBusinessActivities([]);
//   setHasMore(true);
//   fetchActivities(1, value, true); // 🔁 Replace options with searched data
// }}
//           onMenuScrollToBottom={handleMenuScrollToBottom}
//           isLoading={loading}
//           loadingMessage={() => 'Loading...'}
//           noOptionsMessage={() => searchInput ? 'No results found' : 'Start typing to search'}
//         />

//         {/* Selected badges */}
//         <div className="mb-3 d-flex flex-wrap gap-2">
//           {selectedActivities.map((activity) => {
//             const option = activityOptions.find(opt => opt.value === activity.id);
//             return (
//               <span
//                 key={activity.id}
//                 className="badge bg-primary d-flex align-items-center"
//                 style={{ padding: '0.5rem 0.75rem', borderRadius: '20px' }}
//               >
//                 {option ? option.label : activity.activity_name}
//                 <FaTimes
//                   onClick={() => removeSelectedActivity(activity.id)}
//                   style={{
//                     marginLeft: '8px',
//                     cursor: 'pointer',
//                     fontSize: '0.9rem',
//                   }}
//                 />
//               </span>
//             );
//           })}
//         </div>
//       </div>

//       {/* Scrollable activity grid area */}
//       <div
//         style={{
//           flexGrow: 1,
//           overflowY: 'auto',
//           paddingRight: '10px',
//           position: 'relative',
//         }}
//       >
//         {initialLoad ? (
//           <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="alert alert-danger">{error}</div>
//         ) : businessActivities.length === 0 ? (
//           <div className="text-center text-muted py-5">No activities found</div>
//         ) : (
//           <>
//             <div className="row">
//               {businessActivities.map((item) => {
//                 const isSelected = selectedActivities.some(activity => activity.id === item.id);
//                 return (
//                   <div key={item.id} className="col-3 p-2">
//                     <CardSelector
//                       type="checkbox"
//                       title={item.activity_name}
//                       activity_code={item.activity_code}
//                       selected={isSelected}
//                       onClick={() => handleActivityToggle(item)}
//                       name="activity_group"
//                     />
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Loader ref and status messages */}
//             <div ref={loader} style={{ height: '20px' }} />
//             {loading && (
//               <div className="d-flex justify-content-center my-3">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             )}
//             {!hasMore && businessActivities.length > 0 && (
//               <div className="text-center text-muted py-3">
//                 All activities loaded
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BusinessActivityStepSelector;
