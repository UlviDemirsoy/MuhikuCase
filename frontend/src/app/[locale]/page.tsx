"use client";
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import ProductModal from '@/components/ProductModal'; 
import Image from 'next/image';
import { Product } from '@/models/Product';

const Page = () => {
  const t = useTranslations('Home');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [inStock, setInStock] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | '' }>({ key: '', direction: '' });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters(); 
  }, [products, minPrice, maxPrice, inStock]);

  useEffect(() => {
    applySorting();
  }, [sortConfig, filteredProducts]);

  const fetchProducts = () => {
    fetch(`${API_BASE_URL}/products/get`, {
      cache: 'no-store',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (minPrice !== '' || maxPrice !== '') {
      filtered = filtered.filter((product) => {
        const price = product.price;
        const min = minPrice !== '' ? Number(minPrice) : 0;
        const max = maxPrice !== '' ? Number(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    if (inStock) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    setFilteredProducts(filtered);
  };

  const applySorting = () => {
    if (sortConfig.key) {
      const sorted = [...filteredProducts].sort((a, b) => {
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortConfig.key === 'price') {
          return sortConfig.direction === 'asc' ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
      setFilteredProducts(sorted);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleUpdate = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    fetch(`${API_BASE_URL}/products/delete/${productId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete product');
        }
        setProducts(products.filter((product) => product._id !== productId));
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = (updatedProduct: Partial<Product>) => {
    if (selectedProduct) {
      fetch(`${API_BASE_URL}/products/update/${selectedProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })
        .then((res) => res.json())
        .then(() => {
          fetchProducts();
          handleModalClose();
        });
    } else {
      fetch(`${API_BASE_URL}/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })
        .then((res) => res.json())
        .then(() => {
          fetchProducts();
          handleModalClose();
        });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => setIsModalOpen(true)}>{t('create')}</Button>
      </div>

      <div className="flex items-center mb-4 space-x-4">
        <div className="flex flex-col">
          <Input
            placeholder={t('minPrice')}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            type="number"
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-col">
          <Input
            placeholder={t('maxPrice')}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
            className="max-w-xs"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label htmlFor="inStock">{t('inStock')}</label>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">{t('name')}</TableHead>
            <TableHead onClick={() => handleSort('price')} className="cursor-pointer">{t('price')}</TableHead>
            <TableHead>{t('stock')}</TableHead>
            <TableHead>{t('description')}</TableHead>
            <TableHead>{t('featuredImage')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product._id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage}
                    alt="Featured"
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleUpdate(product)} variant="secondary">
                  {t('update')}
                </Button>
                <Button onClick={() => handleDelete(product._id)} variant="destructive" className="ml-2">
                  {t('delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Page;
