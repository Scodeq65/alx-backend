#!/usr/bin/env python3
""" LFUCache module """

from base_caching import BaseCaching
from collections import OrderedDict


class LFUCache(BaseCaching):
    """ LFUCache defines a Least Frequently Used (LFU) caching system """

    def __init__(self):
        """ Initialize the cache """
        super().__init__()
        self.usage_freq = {}  # Tracks frequency of each key
        self.cache_data = OrderedDict()  # OrderedDict to keep insertion order

    def put(self, key, item):
        """ Add an item to the cache.
        If the cache exceeds the limit, discard the least frequently used item.
        If there is a tie, discard the least recently used item.
        """
        if key is None or item is None:
            return

        # If key already exists, update the item and increment its usage count
        if key in self.cache_data:
            self.cache_data[key] = item
            self.usage_freq[key] += 1
            self.cache_data.move_to_end(key)
        else:
            # Add the new key and set its usage frequency to 1
            self.cache_data[key] = item
            self.usage_freq[key] = 1

            # If cache exceeds the max limit, remove the LFU/LRU item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                # Find the least frequently used items
                min_freq = min(self.usage_freq.values())
                lfu_keys = [
                    k for k, v in self.usage_freq.items() if v == min_freq
                ]

                # Resolve ties using the LRU rule
                if len(lfu_keys) > 1:
                    lfu_key = next(
                        iter(k for k in self.cache_data if k in lfu_keys)
                    )
                else:
                    lfu_key = lfu_keys[0]

                # Discard the LFU/LRU key
                del self.cache_data[lfu_key]
                del self.usage_freq[lfu_key]
                print(f"DISCARD: {lfu_key}")

    def get(self, key):
        """ Get an item by key.
        If key is None or doesn’t exist, return None.
        """
        if key is None or key not in self.cache_data:
            return None

        # Increase the usage frequency for the key
        self.usage_freq[key] += 1
        """Move the key to the end to mark it as recently
        used in case of frequency tie.
        """
        self.cache_data.move_to_end(key)
        return self.cache_data[key]
