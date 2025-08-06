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
//  const fetchActivities = useCallback(async (pageNum) => {
//   if (loadingRef.current) return;
//   loadingRef.current = true;
//   setLoading(true);
//   setError(null);

//   try {
//     const res = await dispatch(
//       getBusinessActivityByAuthorityId({
//         authority_id,
//         page: pageNum,
//         limit: PAGE_SIZE, // ✅ Rename from PAGE_SIZE to limit
//       })
//     );

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
      

//       setBusinessActivities((prev) => {
//         const newItems = data.filter((item) => !prev.some((existing) => existing.id === item.id));
//         return [...prev, ...newItems];
//       });

//       const newOptions = data.map((item) => ({
//         value: item.id,
//         label: `(${item.activity_code}) ${item.activity_name}`,
//         code: item.activity_code,
//         data: item // Store the full object here
//       }));

//       setActivityOptions((prev) => {
//         const combined = [...prev, ...newOptions];
//         return Array.from(new Map(combined.map((o) => [o.value, o])).values());
//       });
//     } catch (err) {
//       console.error('Error fetching activities:', err);
//       setError('Failed to load activities. Please try again.');
//       setHasMore(false);
//     } finally {
//       loadingRef.current = false;
//       setLoading(false);
//       setInitialLoad(false);
//     }
//   }, [dispatch, authority_id, businessActivities.length]);

//   // Reset state when authority_id changes
//   // useEffect(() => {
//   //   if (step === 3) {
//   //     setBusinessActivities([]);
//   //     setActivityOptions([]);
//   //     setPage(1);
//   //     setHasMore(true);
//   //     setInitialLoad(true);
//   //     loadingRef.current = false;
//   //   }
//   // }, [authority_id, step]);
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

//   const handleActivityChange = (selectedOptions) => {
//     const selectedItems = selectedOptions
//       .map((opt) => businessActivities.find((act) => act.id === opt.value))
//       .filter(Boolean);
    
//     if (selectedItems.length <= max_activity_selected) {
//       setSelectedActivities(selectedItems);
//     } else {
//       showToast('warning', `You can select up to ${max_activity_selected} activities only`);
//     }
//   };

//   const removeSelectedActivity = (id) => {
//     setSelectedActivities((prev) => prev.filter((item) => item.id !== id));
//   };

//   if (step !== 3) return null;

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
//         <Select
//           isMulti
//           options={activityOptions}
//           value={activityOptions.filter((opt) =>
//             selectedActivities.some(item => item.id === opt.value)
//           )}
//           onChange={handleActivityChange}
//           placeholder="Search by name or code..."
//           className="mb-3"
//           components={{ MultiValue: () => null }}
//           filterOption={(option, inputValue) => {
//             const label = option.label?.toLowerCase() || '';
//             const code = option.data?.code?.toLowerCase() || '';
//             const input = inputValue.toLowerCase();
//             return label.includes(input) || code.includes(input);
//           }}
//           isLoading={loading}
//           loadingMessage={() => 'Loading...'}
//           noOptionsMessage={() => 'No activities found'}
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

  // Toast
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };

  // States
  const [businessActivities, setBusinessActivities] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const loader = useRef(null);
  const observer = useRef(null);
  const loadingRef = useRef(false);

  // Fetch function
  const fetchActivities = useCallback(async (pageNum, keyword = '') => {
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
          search: keyword,
        })
      );

      if (res.error) throw new Error(res.error.message || 'Failed to load');

      const data = res.payload?.data || [];

      // Update activities and options
      setBusinessActivities((prev) => {
        const newItems = pageNum === 1 ? data : [...prev, ...data.filter(d => !prev.some(p => p.id === d.id))];
        return newItems;
      });

      const newOptions = data.map((item) => ({
        value: item.id,
        label: `(${item.activity_code}) ${item.activity_name}`,
        code: item.activity_code,
        data: item,
      }));

      setActivityOptions((prev) => {
        const all = pageNum === 1 ? newOptions : [...prev, ...newOptions];
        return Array.from(new Map(all.map((o) => [o.value, o])).values());
      });

      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
      setError('Failed to load activities.');
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setInitialLoad(false);
    }
  }, [dispatch, authority_id]);

  // Reset on step/authority change
  useEffect(() => {
    if (step === 3) {
      setPage(1);
      setBusinessActivities([]);
      setActivityOptions([]);
      setHasMore(true);
      setInitialLoad(true);
      loadingRef.current = false;
      fetchActivities(1, searchInput);
    }
  }, [step, authority_id]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 3 && searchInput.length >= 2) {
        setPage(1);
        setBusinessActivities([]);
        setActivityOptions([]);
        setHasMore(true);
        fetchActivities(1, searchInput);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load more on scroll to bottom in card list
  useEffect(() => {
    if (!hasMore || step !== 3) return;

    const options = { root: null, rootMargin: '100px', threshold: 0.1 };
    const callback = (entries) => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        setPage(prev => prev + 1);
      }
    };

    observer.current = new IntersectionObserver(callback, options);
    if (loader.current) observer.current.observe(loader.current);

    return () => observer.current?.disconnect();
  }, [hasMore, step]);

  // Trigger fetch when page changes
  useEffect(() => {
    if (step === 3 && (initialLoad || page > 1)) {
      fetchActivities(page, searchInput);
    }
  }, [page]);

  // Handle infinite scroll in react-select dropdown
  const handleMenuScrollToBottom = () => {
    if (hasMore && !loadingRef.current) {
      setPage(prev => prev + 1);
    }
  };

  // Select activity logic
  const handleActivityToggle = (activity) => {
    setSelectedActivities((prev) => {
      const exists = prev.some(item => item.id === activity.id);
      if (exists) return prev.filter(item => item.id !== activity.id);
      if (prev.length < max_activity_selected) return [...prev, activity];
      showToast('warning', `You can select up to ${max_activity_selected} activities only`);
      return prev;
    });
  };

  const handleActivityChange = (selectedOptions) => {
    const selectedItems = selectedOptions
      .map((opt) => businessActivities.find((act) => act.id === opt.value))
      .filter(Boolean);
    if (selectedItems.length <= max_activity_selected) {
      setSelectedActivities(selectedItems);
    } else {
      showToast('warning', `You can select up to ${max_activity_selected} activities only`);
    }
  };

  const removeSelectedActivity = (id) => {
    setSelectedActivities((prev) => prev.filter((item) => item.id !== id));
  };

  if (step !== 3) return null;

  return (
    <div className="d-flex flex-column" style={{ height: '60vh' }}>
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      {/* Header + Select */}
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
          inputValue={searchInput}
          onInputChange={setSearchInput}
          onMenuScrollToBottom={handleMenuScrollToBottom}
          isLoading={loading}
          loadingMessage={() => 'Loading...'}
          noOptionsMessage={() => searchInput ? 'No results found' : 'Start typing to search'}
        />

        {/* Selected badges */}
        <div className="mb-3 d-flex flex-wrap gap-2">
          {selectedActivities.map((activity) => {
            const option = activityOptions.find(opt => opt.value === activity.id);
            return (
              <span key={activity.id} className="badge bg-primary d-flex align-items-center" style={{ padding: '0.5rem 0.75rem', borderRadius: '20px' }}>
                {option ? option.label : activity.activity_name}
                <FaTimes onClick={() => removeSelectedActivity(activity.id)} style={{ marginLeft: '8px', cursor: 'pointer', fontSize: '0.9rem' }} />
              </span>
            );
          })}
        </div>
      </div>

      {/* Scrollable card grid */}
      <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px', position: 'relative' }}>
        {initialLoad ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : businessActivities.length === 0 ? (
          <div className="text-center text-muted py-5">No activities found</div>
        ) : (
          <>
            <div className="row">
              {businessActivities.map((item) => {
                const isSelected = selectedActivities.some(activity => activity.id === item.id);
                return (
                  <div key={item.id} className="col-3 p-2">
                    <CardSelector
                      type="checkbox"
                      title={item.activity_name}
                      activity_code={item.activity_code}
                      selected={isSelected}
                      onClick={() => handleActivityToggle(item)}
                      name="activity_group"
                    />
                  </div>
                );
              })}
            </div>

            {/* Observer target */}
            <div ref={loader} style={{ height: '20px' }} />
            {loading && (
              <div className="d-flex justify-content-center my-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
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

