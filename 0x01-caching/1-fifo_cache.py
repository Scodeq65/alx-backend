#!/usr/bin/env python3
""" FIFOCache module """

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ FIFOCache defines a FIFO caching system """

    def __init__(self):
        """ Initialize the cache """
        super().__init__()
        self.order = []  # To keep track of the order of keys for FIFO

    def put(self, key, item):
        """ Add an item to the cache.
        If the cache exceeds the limit, discard the first added item (FIFO).
        """
        if key is not None and item is not None:
            if key not in self.cache_data:
                self.order.append(key)
            self.cache_data[key] = item

            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                # Remove the oldest item from the cache based on FIFO
                oldest_key = self.order.pop(0)  # FIFO removal
                del self.cache_data[oldest_key]
                print(f"DISCARD: {oldest_key}")

    def get(self, key):
        """ Get an item by key.
        If key is None or doesn’t exist, return None.
        """
        return self.cache_data.get(key, None)
