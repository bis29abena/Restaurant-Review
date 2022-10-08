import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

import "./comp-styles.css"

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [pageCounter, setPageCounter] = useState(0)
  const [totalResults, setTotalResults] = useState("")
  const [cuisines, setCuisines] = useState(["All Cuisines"]);
  const [search, setSearch] = useState({
    name: "",
    zip: "",
    cuisine_: "",
  });

  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  let totalPages = Math.round(totalResults / 20);

  const nextPage = () => {
    if (pageCounter >= totalPages) {
      setPageCounter(totalPages);
    } else {
      setPageCounter(pageCounter + 1);
    }

    if (search.name) {
      find(search.name, "name", pageCounter)
    } else if(search.zip) {
      find(search.zip, "zipcode", pageCounter);
    } else if (search.cuisine_) {
      if (search.cuisine_ === "All Cuisines") {
        refreshList();
      } else {
        find(search.cuisine_, "cuisine", pageCounter);
      }
    } else {
      retrieveRestaurants()
    }
  }

  const prevPage = () => {
    if (pageCounter <= 0) {
      setPageCounter(0);
    } else {
      setPageCounter(pageCounter - 1);
    }
    
    if (search.name) {
      find(search.name, "name", pageCounter)
    } else if(search.zip) {
      find(search.zip, "zipcode", pageCounter);
    } else if (search.cuisine_) {
      if (search.cuisine_ === "All Cuisines") {
        refreshList();
      } else {
        find(search.cuisine_, "cuisine", pageCounter);
      }
    } else {
      retrieveRestaurants()
    }
  }

  const onChangeSearch = (e) => {
    const { name, value } = e.target;

    setSearch((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const retrieveRestaurants = () => {
    RestaurantDataService.getAll(pageCounter)
      .then((response) => {
        console.log(response.data);
        setTotalResults(response.data.total_results)
        setRestaurants(response.data.restaurants);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then((response) => {
        console.log(response.data);
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveRestaurants();
  };

  const find = (query, by, pageCounter) => {
    RestaurantDataService.find(query, by, pageCounter)
      .then((response) => {
        console.log(response.data);
        setTotalResults(response.data.total_results)
        setRestaurants(response.data.restaurants);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(search.name, "name");
    setPageCounter(0)
  };

  const findByZip = () => {
    find(search.zip, "zipcode");
    setPageCounter(0)
  };

  const findByCuisine = () => {
    console.log(search.cuisine_);
    if (search.cuisine_ === "All Cuisines") {
      refreshList();
    } else {
      find(search.cuisine_, "cuisine");
    }
    setPageCounter(0)
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={search.name}
            name="name"
            onChange={onChangeSearch}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={search.zip}
            name="zip"
            onChange={onChangeSearch}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearch} name="cuisine_">
            {cuisines.map((cuisine) => {
              return <option value={cuisine}> {cuisine.substr(0, 20)} </option>;
            })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="page_btns mb-3 mt-3">
        <a class="previous" onClick={prevPage}>
          &laquo; Previous
        </a>
        <span>{pageCounter}</span>
        <a class="next" onClick={nextPage}>
          Next &raquo;
        </a>
      </div>
      <div className="row">
        {restaurants.map((restaurant) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>
                    {restaurant.cuisine}
                    <br />
                    <strong>Address: </strong>
                    {address}
                  </p>
                  <div className="row">
                    <Link
                      to={"/restaurants/" + restaurant._id}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Reviews
                    </Link>
                    <a
                      href={"https://www.google.com/maps/place/" + address}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantsList;
