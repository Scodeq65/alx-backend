#!/usr/bin/env python3
""" LRUCache module """

from base_caching import BaseCaching
from collections import OrderedDict


class LRUCache(BaseCaching):
    """ LRUCache defines a Least Recently Used (LRU) caching system """

    def __init__(self):
        """ Initialize the cache """
        super().__init__()
        self.cache_data = OrderedDict()  # Use OrderedDict to maintain order

    def put(self, key, item):
        """ Add an item to the cache.
        If the cache exceeds the limit, discard the least recently used item.
        """
        if key is None or item is None:
            return

        # If key already exists, move it to the end (most recent)
        if key in self.cache_data:
            self.cache_data.move_to_end(key)

        self.cache_data[key] = item  # Add or update the item

        # If cache exceeds max items, pop the first item (LRU)
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            # Pop the least recently used item (first item in OrderedDict)
            oldest_key, _ = self.cache_data.popitem(last=False)
            print(f"DISCARD: {oldest_key}")

    def get(self, key):
        """ Get an item by key.
        If key is None or doesn’t exist, return None.
        """
        if key is None or key not in self.cache_data:
            return None

        # Move the accessed key to the end to mark it as recently used
        self.cache_data.move_to_end(key)
        return self.cache_data[key]
