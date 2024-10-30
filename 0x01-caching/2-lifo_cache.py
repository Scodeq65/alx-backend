#!/usr/bin/env python3
""" LIFOCache module """

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ LIFOCache defines a LIFO caching system """

    def __init__(self):
        """ Initialize the cache """
        super().__init__()
        self.last_key = None

    def put(self, key, item):
        """ Add an item to the cache.
        If the cache exceeds the limit, discard the last added item (LIFO).
        """
        if key is not None and item is not None:
            self.cache_data[key] = item
            # Track the last item added
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                # Remove the most recent item added
                if self.last_key:
                    del self.cache_data[self.last_key]
                    print(f"DISCARD: {self.last_key}")
            self.last_key = key  # Update last added key

    def get(self, key):
        """ Get an item by key.
        If key is None or doesn’t exist, return None.
        """
        return self.cache_data.get(key, None)
