from rest_framework import pagination


class CoursePaginator(pagination.PageNumberPagination):
    page_size = 5