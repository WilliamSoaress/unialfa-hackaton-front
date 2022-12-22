export class Page<T> {
    content: T[] = [];
    pageable!: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    paged: boolean;
    unpaged: boolean;
  };
    last: boolean = false;
    totalElements!: number;
    totalPages!: number;
    size!: number;
    number!: number;
    numberOfElements!: number;
    first: boolean = false;
    sort!: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
    empty: boolean = false;

    hasNext(): boolean {
      return this.number < this.totalPages - 1;
    }

    hasPrevious(): boolean {
      return this.number > 0;
    }
  }
