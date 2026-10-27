import MoviesService from '../services/movies.service.js';

export default class MoviesController {

    static async create(req, res) {

        try {

            const movie = {
                ...req.body,
                status: 'approved',
                created_by: req.user.id
            };

            const result = await MoviesService.create(movie);

            return res.status(201).json({
                status: 'success',
                message: 'Película creada correctamente',
                data: {
                    id: result.insertId
                }
            });

        } catch (error) {

            return res.status(400).json({
                status: 'error',
                message: error.message
            });

        }

    }

    static async getAll(req, res) {

        try {

            const filters = {
                category: req.query.category,
                title: req.query.title
            };

            const movies =
                await MoviesService.getAll(filters);

            return res.status(200).json({
                status: 'success',
                total: movies.length,
                data: movies
            });

        } catch (error) {

            return res.status(500).json({
                status: 'error',
                message: error.message
            });

        }

    }

    static async getById(req, res) {

        try {

            const { id } = req.params;

            const movie =
                await MoviesService.getById(id);

            return res.status(200).json({
                status: 'success',
                data: movie
            });

        } catch (error) {

            return res.status(404).json({
                status: 'error',
                message: error.message
            });

        }

    }

    static async update(req, res) {

        try {

            const { id } = req.params;

            await MoviesService.update(
                id,
                req.body
            );

            return res.status(200).json({
                status: 'success',
                message: 'Película actualizada correctamente'
            });

        } catch (error) {

            return res.status(400).json({
                status: 'error',
                message: error.message
            });

        }

    }

    static async approve(req, res) {

        try {

            const { id } = req.params;

            await MoviesService.approve(id);

            return res.status(200).json({
                status: 'success',
                message: 'Película aprobada correctamente'
            });

        } catch (error) {

            return res.status(400).json({
                status: 'error',
                message: error.message
            });

        }

    }

    static async delete(req, res) {

        try {

            const { id } = req.params;

            await MoviesService.deleteMovie(id);

            return res.status(200).json({
                status: 'success',
                message: 'Película eliminada correctamente'
            });

        } catch (error) {

            return res.status(400).json({
                status: 'error',
                message: error.message
            });

        }

    }

}