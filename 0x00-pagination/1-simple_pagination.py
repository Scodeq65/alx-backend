#!/usr/bin/env python3
"""
Pagination helper function and Server class
"""

import csv
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Calculate the start and end index for a page of data.

    Args:
        page (int): The page number (1-indexed).
        page_size (int): The number of items per page.

    Returns:
        Tuple[int, int]: A tuple with the start and end indexes.
    """
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index


class Server:
    """Server class to paginate a database of popular baby names."""

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Load and cache the dataset from the CSV file."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]  # Exclude the header row
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Returns a page of data based on pagination parameters.

        Args:
            page (int): The page number (1-indexed, default is 1).
            page_size (int): The number of items per page (default is 10).

        Returns:
            List[List]: A list of rows for the specified page.
        """
        # Ensure page and page_size are valid integers greater than 0
        assert isinstance(page, int) and page > 0, \
            "Page must be a positive integer"
        assert isinstance(page_size, int) and page_size > 0, \
            "Page size must be a positive integer"

        # Calculate start and end indexes using index_range function
        start_index, end_index = index_range(page, page_size)

        # Fetch the dataset
        dataset = self.dataset()

        # Return the appropriate slice, or an empty list if out of range
        return dataset[start_index:end_index] \
            if start_index < len(dataset) else []
