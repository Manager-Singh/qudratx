// views/pages/EmployeePortal/BusinessActivityInfiniteList.jsx
import React, { useEffect, useState, useRef } from 'react'
import BusinessActivityGrid from './components/BusinessActivityGrid'

const PAGE_SIZE = 20

const BusinessActivityInfiniteList = () => {
  const [businessActivities, setBusinessActivities] = useState([])
  const [selectedActivities, setSelectedActivities] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const loader = useRef(null)

  const fetchActivities = async (page) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/business-activities?page=${page}&limit=${PAGE_SIZE}`)
      const data = await res.json()

      if (data.length < PAGE_SIZE) setHasMore(false)
      setBusinessActivities((prev) => [...prev, ...data])
    } catch (err) {
      console.error('Error fetching activities:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchActivities(page)
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1 }
    )

    if (loader.current) observer.observe(loader.current)
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [loader, hasMore, loading])

  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <BusinessActivityGrid
      activities={businessActivities}
      selectedActivities={selectedActivities}
      onToggle={handleActivityToggle}
      loaderRef={loader}
      hasMore={hasMore}
    />
  )
}

export default BusinessActivityInfiniteList
