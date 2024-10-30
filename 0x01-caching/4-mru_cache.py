#!/usr/bin/env python3
""" MRUCache module """

from base_caching import BaseCaching
from collections import OrderedDict


class MRUCache(BaseCaching):
    """ MRUCache defines a Most Recently Used (MRU) caching system """

    def __init__(self):
        """ Initialize the cache """
        super().__init__()
        self.cache_data = OrderedDict()
        self.last_key = None  # Keep track of the most recently used key

    def put(self, key, item):
        """ Add an item to the cache.
        If the cache exceeds the limit, discard the most recently used item.
        """
        if key is None or item is None:
            return

        # If key already exists, remove it
        # so we can update it as the most recent
        if key in self.cache_data:
            del self.cache_data[key]

        self.cache_data[key] = item  # Add or update the item
        self.last_key = key  # Update the most recently used key

        # If cache exceeds max items, pop the last item accessed (MRU)
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discarded_key, _ = self.cache_data.popitem(last=True)
            print(f"DISCARD: {discarded_key}")

    def get(self, key):
        """ Get an item by key.
        If key is None or doesn’t exist, return None.
        """
        if key is None or key not in self.cache_data:
            return None

        # Mark the key as most recently accessed by moving it to the end
        self.cache_data.move_to_end(key)
        self.last_key = key  # Update the most recently used key
        return self.cache_data[key]
